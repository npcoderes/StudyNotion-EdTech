const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Make sure this matches exactly
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // Make sure this matches exactly
    required: true
  },
  scorePercentage: {
    type: Number,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure one certificate per user-course combination
certificateSchema.index({ user: 1, course: 1 }, { unique: true });

// Export with a check to prevent duplicate model registration
module.exports = mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);