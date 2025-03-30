const express = require("express");
const router = express.Router();
const { auth, isStudent } = require("../middleware/auth");

const {
  getStudentExam,
  startExamAttempt,
  saveAnswer,
  submitExamAttempt,
  getExamHistory,
  submitExam,
  getExamResults
} = require("../controllers/examController");

// Routes
router.get("/student/:courseId", auth, isStudent, getStudentExam);
router.post("/attempt/start/:courseId", auth, isStudent, startExamAttempt);
router.post("/attempt/save/:attemptId", auth, isStudent, saveAnswer);
router.post("/attempt/submit/:attemptId", auth, isStudent, submitExamAttempt);
router.get("/history/:courseId", auth, isStudent, getExamHistory);
router.post("/submit", auth, submitExam);
router.get("/results/:courseId", auth, getExamResults);

module.exports = router;