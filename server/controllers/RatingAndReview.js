const RatingAndReview = require("../models/RatingAndRaview");
const Course = require("../models/Course");
const { mongo, default: mongoose } = require("mongoose");
const User = require("../models/User");
const natural = require('natural'); // For sentiment analysis
const tokenizer = new natural.WordTokenizer();
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");

//createRating
exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;

        // Verify enrollment
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled in the course',
            });
        }

        // Check for existing review
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: 'Course is already reviewed by the user',
            });
        }

        // Perform sentiment analysis
        const tokens = tokenizer.tokenize(review || "");
        const sentiment = analyzer.getSentiment(tokens);

        // Create rating with sentiment score
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId,
            sentimentScore: sentiment
        });

        // Populate user and course details
        await ratingReview.populate('user', 'firstName lastName email image');
        await ratingReview.populate('course', 'courseName');

        // Update course
        await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                }
            },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            message: "Rating and Review created Successfully",
            data: ratingReview,
        });
    } catch (error) {
        console.error("Error in createRating:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating rating",
            error: error.message
        });
    }
}

//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
        //get course ID
        const courseId = req.body.courseId;
        //calculate avg rating

        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                }
            }
        ])

        //return rating
        if (result.length > 0) {

            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })

        }

        //if no rating/Review exist
        return res.status(200).json({
            success: true,
            message: 'Average Rating is 0, no ratings given till now',
            averageRating: 0,
        })
    }
    catch (error) {
        // console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//getAllRatingAndReviews

exports.getAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image",
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        });
    }
    catch (error) {
        // console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Performance threshold constants
const MINIMUM_RATING_THRESHOLD = 3.0;
const NEGATIVE_SENTIMENT_THRESHOLD = -0.5;

exports.analyzeInstructorPerformance = async (instructorId) => {
    try {
        // Fetch all courses by instructor
        const courses = await Course.find({ instructor: instructorId });
        const courseIds = courses.map(course => course._id);

        // Calculate average rating
        const ratingData = await RatingAndReview.aggregate([
            { $match: { course: { $in: courseIds } } },
            { $group: { _id: null, averageRating: { $avg: "$rating" } } }
        ]);
        const averageRating = ratingData[0]?.averageRating || 0;

        // Analyze review sentiments
        const reviews = await RatingAndReview.find({ course: { $in: courseIds } });
        const totalSentiment = reviews.reduce((total, review) => {
            const tokens = tokenizer.tokenize(review.review || "");
            return total + analyzer.getSentiment(tokens);
        }, 0);

        const averageSentiment = reviews.length > 0 ? totalSentiment / reviews.length : 0;

        // Performance Analysis
        const isPerformanceCritical =
            averageRating < MINIMUM_RATING_THRESHOLD || averageSentiment < NEGATIVE_SENTIMENT_THRESHOLD;

        return {
            instructorId,
            averageRating,
            averageSentiment,
            totalReviews: reviews.length,
            isPerformanceCritical,
        };
    } catch (error) {
        throw new Error(`Error analyzing instructor performance: ${error.message}`);
    }
};

exports.deactivateInstructor = async (req, res) => {
    try {
        const { instructorId } = req.body;

        // Uncomment and implement admin check if required
        // if (!req.user.isAdmin) {
        //     return res.status(403).json({ success: false, message: "Unauthorized action" });
        // }

        // Deactivate instructor account
        const updatedUser = await User.findByIdAndUpdate(instructorId, { active: false }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Instructor account deactivated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error deactivating instructor account: ${error.message}`,
        });
    }
};

exports.getInstructorAnalytics = async (req, res) => {
    try {
        const id = req.query.id; // Get the ID from query parameters
        console.log("Instructor ID: ", id);
        const insId = new mongoose.Types.ObjectId(id);

        // Ensure instructor exists
        const instructor = await User.findById(insId);
        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }

        // Fetch performance metrics
        const performance = await this.analyzeInstructorPerformance(insId);

        return res.status(200).json({
            success: true,
            data: performance,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error fetching instructor analytics: ${error.message}`,
        });
    }
};

exports.checkExistingRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const courseId = req.params.courseId;

        const existingRating = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        return res.status(200).json({
            success: true,
            exists: !!existingRating,
            rating: existingRating
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error checking existing rating",
            error: error.message
        });
    }
}

exports.updateRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;

        // Verify enrollment
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled in the course',
            });
        }

        // Find and update existing rating
        const updatedRating = await RatingAndReview.findOneAndUpdate(
            { user: userId, course: courseId },
            {
                rating,
                review,
                updatedAt: Date.now()
            },
            { new: true }
        ).populate('user', 'firstName lastName email image')
            .populate('course', 'courseName');

        if (!updatedRating) {
            return res.status(404).json({
                success: false,
                message: 'Rating not found'
            });
        }

        // Perform sentiment analysis on updated review
        const tokens = tokenizer.tokenize(review || "");
        const sentiment = analyzer.getSentiment(tokens);

        // Update with sentiment score
        updatedRating.sentimentScore = sentiment;
        await updatedRating.save();

        return res.status(200).json({
            success: true,
            message: "Rating and Review updated successfully",
            data: updatedRating
        });

    } catch (error) {
        console.error("Error in updateRating:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating rating",
            error: error.message
        });
    }
}
