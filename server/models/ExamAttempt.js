const mongoose = require("mongoose");

const examAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        type: {
          type: String,
          enum: ["mcq", "truefalse", "shortAnswer"],
          required: true,
        },
        selectedOptions: [String], // For MCQ/TrueFalse
        textAnswer: String, // For short answer
      },
    ],
    status: {
      type: String,
      enum: ["in-progress", "submitted", "graded"],
      default: "in-progress",
    },
    score: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    passingScore: {
      type: Number,
      default: 70,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamAttempt", examAttemptSchema);