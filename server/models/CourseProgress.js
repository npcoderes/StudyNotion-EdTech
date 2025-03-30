const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
  // New fields to track certificate requirements
  contentCompleted: {
    type: Boolean,
    default: false,
  },
  examPassed: {
    type: Boolean,
    default: false,
  },
  certificateURL: {
    type: String,
  },
  expireTime: {
    type: Date,
    required: true, // Mark this as required if every course should have an expiration time
  },
});

// Export the model
module.exports = mongoose.model("CourseProgress", courseProgressSchema);
