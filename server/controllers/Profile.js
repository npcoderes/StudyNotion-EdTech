const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const {convertSecondsToDuration} = require("../utils/secToDuration")
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Method for updating a profile
exports.updateProfile = async (req, res) => {
	try {
		const { firstName,lastName,gender,dateOfBirth = "", about = "", contactNumber } = req.body;
		const id = req.user.id;

		// Find the profile by id
		const userDetails = await User.findById(id);
		const profile = await Profile.findById(userDetails.additionalDetails);
        userDetails.firstName=firstName;
		userDetails.lastName=lastName;
		await userDetails.save();
		// Update the profile fields
		profile.dateOfBirth = dateOfBirth;
		profile.about = about;
		profile.contactNumber = contactNumber;
		profile.gender = gender;



		// Save the updated profile
		await profile.save();
    const updatedUserDetails= await User.findById(id)
    .populate("additionalDetails")
    .exec();

		return res.json({
			success: true,
			message: "Profile updated successfully",
			profile,
      updatedUserDetails:updatedUserDetails
		});
	} catch (error) {
		// console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

exports.deleteAccount = async (req, res) => {
	try {
		// console.log("Printing ID: ", req.user.id);
		const id = req.user.id;
		
		const user = await User.findById({ _id: id });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Unenroll User From All the Enrolled Courses
		if (user.courses && user.courses.length > 0) {
			await Course.updateMany(
				{ _id: { $in: user.courses } },
				{ $pull: { studentsEnrolled: id } } 
			);
		}

		// Delete Associated Profile with the User
		await Profile.findByIdAndDelete({ _id: user.additionalDetails });

		// Delete Course Progress for the User
		await CourseProgress.deleteMany({ userId: id });
		// Now Delete User
		await User.findByIdAndDelete({ _id: id });
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		// console.log(error);
		res
			.status(500)
			.json({ success: false, message: "User cannot be deleted successfully" });
	}
};

exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();
		// console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      // console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
// Helper function to convert seconds to HH:MM:SS format
const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user details and populate course content
    let userDetails = await User.findOne({ _id: userId })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    userDetails = userDetails.toObject(); // Convert to plain object

    const currentDate = new Date();
    const filteredCourses = [];

    for (let i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      let subSectionLength = 0;

      // Calculate total duration and number of subsections
      for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration, 10),
          0
        );
        subSectionLength += userDetails.courses[i].courseContent[j].subSection.length;
      }

      // Convert total duration to a readable format
      userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);

      // Fetch course progress and calculate progress percentage
      const courseProgress = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });
      console.log("Course Progress: ", courseProgress);

      const completedVideosCount = courseProgress?.completedVideos.length || 0;
      userDetails.courses[i].progressPercentage =
        subSectionLength === 0
          ? 100
          : Math.round((completedVideosCount / subSectionLength) * 100 * 100) / 100; // Up to 2 decimal points

      // Include expiration time
      userDetails.courses[i].expireTime = courseProgress?.expireTime || null;

      // Check expiration time and add only non-expired courses
      if (!userDetails.courses[i].expireTime || new Date(userDetails.courses[i].expireTime) >= currentDate) {
        filteredCourses.push(userDetails.courses[i]);
      }
    }

    // Return response
    console.log("Filtered Courses: ", filteredCourses);
    return res.status(200).json({
      success: true,
      data: filteredCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * (course.price*80)/100 // Assuming 80% of the course price goes to the instructor 

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}