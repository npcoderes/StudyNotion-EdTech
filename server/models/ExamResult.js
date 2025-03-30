const mongoose = require("mongoose");

const answerDetailSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    required: true,
    enum: ['mcq', 'truefalse', 'shortAnswer']
  },
  yourAnswer: {
    type: String,
    default: ""
  },
  correctAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  earnedPoints: {
    type: Number,
    required: true
  }
});

const examResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  scoredPoints: {
    type: Number,
    required: true,
  },
  totalPoints: {
    type: Number,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  answerDetails: [answerDetailSchema],
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("ExamResult", examResultSchema);