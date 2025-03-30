const RatingAndReview = require("../models/RatingAndRaview");
const Course = require("../models/Course");
const User = require("../models/User");
const mongoose = require("mongoose");

// Get all reviews with pagination
exports.getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await RatingAndReview.find()
      .populate({
        path: "user",
        select: "firstName lastName email image", // Only select necessary fields
      })
      .populate({
        path: "course",
        select: "courseName", // Only select course name
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    const total = await RatingAndReview.countDocuments();
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Get reviews for a specific course with pagination
exports.getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate course ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // Check if course exists
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Get reviews for the course
    const reviews = await RatingAndReview.find({ course: courseId })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total reviews count for pagination
    const total = await RatingAndReview.countDocuments({ course: courseId });
    const totalPages = Math.ceil(total / limit);
    
    // Calculate average rating
    const ratingStats = await RatingAndReview.aggregate([
      { $match: { course: new  mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          ratingCount: { $sum: 1 },
          // Count reviews by rating
          rating5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } }
        }
      }
    ]);

    const ratingDistribution = ratingStats.length > 0 ? {
      averageRating: parseFloat(ratingStats[0].averageRating.toFixed(1)),
      ratingCount: ratingStats[0].ratingCount,
      distribution: {
        5: ratingStats[0].rating5,
        4: ratingStats[0].rating4,
        3: ratingStats[0].rating3,
        2: ratingStats[0].rating2,
        1: ratingStats[0].rating1,
      }
    } : {
      averageRating: 0,
      ratingCount: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };

    return res.status(200).json({
      success: true,
      message: "Course reviews fetched successfully",
      courseName: courseExists.courseName,
      reviews,
      ratingStats: ratingDistribution,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching course reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course reviews",
      error: error.message,
    });
  }
};

// Get analytics of all reviews for admin
exports.getReviewAnalytics = async (req, res) => {
  try {
    // Get overall rating stats
    const overallStats = await RatingAndReview.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          rating5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } }
        }
      }
    ]);

    // Get top rated courses
    const topRatedCourses = await RatingAndReview.aggregate([
      {
        $group: {
          _id: "$course",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        }
      },
      { $sort: { averageRating: -1, reviewCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "courseDetails"
        }
      },
      {
        $project: {
          courseId: "$_id",
          courseName: { $arrayElemAt: ["$courseDetails.courseName", 0] },
          averageRating: 1,
          reviewCount: 1
        }
      }
    ]);

    // Get recent reviews
    const recentReviews = await RatingAndReview.find()
      .populate({
        path: "user",
        select: "firstName lastName image email" 
      })
      .populate({
        path: "course",
        select: "courseName"
      })
      .sort({ _id: -1 })
      .limit(5)
      .exec();

    // Format the stats for frontend
    const stats = overallStats.length > 0 ? {
      averageRating: parseFloat(overallStats[0].averageRating.toFixed(1)),
      totalReviews: overallStats[0].totalReviews,
      distribution: {
        5: overallStats[0].rating5,
        4: overallStats[0].rating4,
        3: overallStats[0].rating3,
        2: overallStats[0].rating2,
        1: overallStats[0].rating1
      }
    } : {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };

    return res.status(200).json({
      success: true,
      message: "Review analytics fetched successfully",
      data: {
        stats,
        topRatedCourses,
        recentReviews
      }
    });
  } catch (error) {
    console.error("Error fetching review analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch review analytics",
      error: error.message
    });
  }
};

// Delete a review (admin only)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID"
      });
    }

    const deletedReview = await RatingAndReview.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message
    });
  }
};