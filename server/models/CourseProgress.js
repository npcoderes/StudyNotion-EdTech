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
  expireTime: {
    type: Date,
    required: true, // Mark this as required if every course should have an expiration time
  },
  certificateURL: {
    type: String,
  }
});

// Export the model
module.exports = mongoose.model("CourseProgress", courseProgressSchema);
