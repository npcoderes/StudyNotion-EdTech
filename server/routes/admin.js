// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course'); // Ensure the correct path to the Course model
const Category = require('../models/Category'); // Ensure the correct path to the Category model
// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")
const { getInstructorAnalytics, deactivateInstructor } = require("../controllers/RatingAndReview");

const { getNotApprovedUser } = require("../controllers/Auth");

const {
  getAllReviews,
  getCourseReviews,
  getReviewAnalytics,
  deleteReview
} = require('../controllers/ReviewController');

const mailSender = require('../utils/mailSender');
// Route to fetch report data
router.get('/report', async (req, res) => {
  try {
    const { startDate, endDate, accountType } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (accountType) {
      query.accountType = accountType;
    }

    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
router.get('/courses', async (req, res) => {
  try {
    const { startDate, endDate, status, category, instructor } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (instructor) {
      query.instructor = instructor;
    }

    console.log('Query:', query); // Log the query

    const courses = await Course.find(query)
      .populate('instructor')
      .populate('category')
      .lean(); // Use lean() to get plain JavaScript objects

    // Add the count of students enrolled in each course
    courses.forEach(course => {
      course.studentsEnrolledCount = course.studentsEnrolled.length;
    });

    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err); // Log the error
    res.status(500).send('Server Error');
  }
});

// Route to fetch all instructors
router.get('/instructors', async (req, res) => {
  try {
    const instructors = await User.find({ accountType: 'Instructor' });
    res.json(instructors);
  } catch (err) {
    console.error('Error fetching instructors:', err);
    res.status(500).send('Server Error');
  }
});

// Route to fetch all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).send('Server Error');
  }
});


router.get('/notApprovedUser', getNotApprovedUser)

router.post('/approveUser', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Approving user:', userId);
    const user = await User.findByIdAndUpdate(userId, { approved: true }, { new: true });
    await mailSender(
      user.email,
      'Account Approval Request Response',
      `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <header style="text-align: center; padding-bottom: 20px;">
              <h1 style="color: #E53E3E;">StudyNotion</h1>
            </header>
            <main>
              <h2>Hello ${user.firstName} ${user.lastName},</h2>
              <p>We are pleased to inform you that your account approval request has been approved. You can now login to your account and start exploring our platform.</p>
              <p>If you have any questions or need further assistance, please contact our support team.</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://studynotion.com/support" style="background-color: #E53E3E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Contact Support</a>
              </div>
            </main>
            <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="font-size: 0.9em; color: #777;">&copy; 2023 StudyNotion. All rights reserved.</p>
            </footer>
          </div>
        </body>
      </html>
      `
    )
    res.json(user);
  } catch (err) {
    console.error('Error approving user:', err);
    res.status(500).send('Server Error');
  }
}
);

router.post('/deapproveuser', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Deapproving user:', userId);
    const user = await User.findByIdAndUpdate(userId, { approved: false }, { new: true });
    await mailSender(
      user.email,
      'Account Approval Request Response',
      `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <header style="text-align: center; padding-bottom: 20px;">
              <h1 style="color: #E53E3E;">StudyNotion</h1>
            </header>
            <main>
              <h2>Hello ${user.firstName} ${user.lastName},</h2>
              <p>We regret to inform you that your account approval request has been denied. Please ensure that all the details provided are accurate and try again later.</p>
              <p>If you have any questions or need further assistance, please contact our support team.</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://studynotion.com/support" style="background-color: #E53E3E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Contact Support</a>
              </div>
            </main>
            <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="font-size: 0.9em; color: #777;">&copy; 2023 StudyNotion. All rights reserved.</p>
            </footer>
          </div>
        </body>
      </html>
      `
    );

    let deletedUser = await User.findByIdAndDelete(userId);
    

    res.json(
      {
        message: "User deleted successfully",
        deletedUser: deletedUser,
        success: true
      }
    );
  } catch (err) {
    console.error('Error deapproving user:', err);
  }
});

router.post('/activeUser', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Approving user:', userId);
    const user = await User.findByIdAndUpdate(userId, { active: true }, { new: true });
    res.json({
      success: true,
      message: "User activated successfully",
      user: user
    });
  } catch (err) {
    console.error('Error approving user:', err);
    res.status(500).send('Server Error');
  }
}
);

router.get("/instructor-analytics",  getInstructorAnalytics)
router.post("/deactivate-instructor", auth, isAdmin, deactivateInstructor)


// Admin routes
router.get('/reviews', auth, isAdmin, getAllReviews);
router.get('/reviews/analytics', auth, isAdmin, getReviewAnalytics);
router.get('/reviews/course/:courseId', auth, isAdmin, getCourseReviews);
router.delete('/reviews/:reviewId', auth, isAdmin, deleteReview);


module.exports = router;          