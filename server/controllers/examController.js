// Import mongoose with all models registered
const mongoose = require('../models/indexModal');

// Use mongoose.model to get models
const ExamResult = mongoose.model('ExamResult');
const Course = mongoose.model('Course');
const User = mongoose.model('User');
const ExamAttempt = mongoose.model('ExamAttempt');
const CourseProgress = mongoose.model('CourseProgress');

// Functions for exam controller
exports.getStudentExam = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Validate course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if student is enrolled
    const isEnrolled = course.studentsEnrolled.includes(studentId);
    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Check if course has an exam
    if (!course.hasExam || !course.exam) {
      return res.status(404).json({
        success: false,
        message: "This course does not have an exam",
      });
    }

    // Check if student already has a graded attempt
    const previousAttempt = await ExamAttempt.findOne({
      student: studentId,
      courseID: courseId,
      status: "graded"
    });

    // Return exam data with/without previous attempt
    return res.status(200).json({
      success: true,
      exam: {
        title: course.exam.title,
        description: course.exam.description,
        timeLimit: course.exam.timeLimit,
        passingScore: course.exam.passingScore,
        showResults: course.exam.showResults,
        randomizeQuestions: course.exam.randomizeQuestions,
        questions: course.exam.questions.map(q => ({
          _id: q._id,
          question: q.question,
          type: q.type,
          points: q.points,
          options: q.type !== "shortAnswer" ? q.options.map(o => ({
            _id: o._id,
            text: o.text
          })) : undefined
        })),
        previousAttempt: previousAttempt ? {
          score: previousAttempt.score,
          totalPoints: previousAttempt.totalPoints,
          percentage: previousAttempt.percentage,
          passed: previousAttempt.passed,
          passingScore: previousAttempt.passingScore,
          submittedAt: previousAttempt.submittedAt
        } : null
      },
    });
  } catch (error) {
    console.error("Error getting student exam:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get exam details",
      error: error.message,
    });
  }
};

exports.startExamAttempt = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Validate course and exam
    const course = await Course.findById(courseId);
    if (!course || !course.hasExam) {
      return res.status(404).json({
        success: false,
        message: "Course or exam not found",
      });
    }

    // Check if student is enrolled
    const isEnrolled = course.studentsEnrolled.includes(studentId);
    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Check if there's an in-progress attempt
    let examAttempt = await ExamAttempt.findOne({
      student: studentId,
      courseID: courseId,
      status: "in-progress",
    });

    // If no in-progress attempt, create a new one
    if (!examAttempt) {
      examAttempt = await ExamAttempt.create({
        student: studentId,
        courseID: courseId,
        passingScore: course.exam.passingScore,
        totalPoints: course.exam.questions.reduce(
          (total, q) => total + q.points,
          0
        ),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exam attempt started",
      attempt: examAttempt,
      timeLimit: course.exam.timeLimit,
    });
  } catch (error) {
    console.error("Error starting exam attempt:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to start exam attempt",
      error: error.message,
    });
  }
};

exports.saveAnswer = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { questionId, answer } = req.body;
    const studentId = req.user.id;

    // Validate exam attempt
    const examAttempt = await ExamAttempt.findById(attemptId);
    if (!examAttempt) {
      return res.status(404).json({
        success: false,
        message: "Exam attempt not found",
      });
    }

    // Verify student ownership
    if (examAttempt.student.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this exam attempt",
      });
    }

    // Check if attempt is still in progress
    if (examAttempt.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        message: "This exam attempt has already been submitted",
      });
    }

    // Update or add the answer
    const existingAnswerIndex = examAttempt.answers.findIndex(
      (a) => a.questionId.toString() === questionId
    );

    if (existingAnswerIndex >= 0) {
      // Update existing answer
      examAttempt.answers[existingAnswerIndex] = {
        ...examAttempt.answers[existingAnswerIndex],
        ...answer,
      };
    } else {
      // Add new answer
      examAttempt.answers.push({
        questionId,
        ...answer,
      });
    }

    await examAttempt.save();

    return res.status(200).json({
      success: true,
      message: "Answer saved successfully",
    });
  } catch (error) {
    console.error("Error saving answer:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save answer",
      error: error.message,
    });
  }
};

exports.submitExamAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const studentId = req.user.id;

    // Validate exam attempt
    const examAttempt = await ExamAttempt.findById(attemptId);
    if (!examAttempt) {
      return res.status(404).json({
        success: false,
        message: "Exam attempt not found",
      });
    }

    // Verify student ownership
    if (examAttempt.student.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this exam attempt",
      });
    }

    // Check if attempt is still in progress
    if (examAttempt.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        message: "This exam attempt has already been submitted",
      });
    }

    // Get the course with exam questions
    const course = await Course.findById(examAttempt.courseID);
    if (!course || !course.hasExam) {
      return res.status(404).json({
        success: false,
        message: "Course exam not found",
      });
    }

    // Grade the exam
    let score = 0;
    const totalPoints = course.exam.questions.reduce(
      (acc, question) => acc + question.points,
      0
    );

    // For each answer, find the corresponding question and grade it
    for (const answer of examAttempt.answers) {
      const question = course.exam.questions.find(
        (q) => q._id.toString() === answer.questionId.toString()
      );

      if (!question) continue;

      // Grade based on question type
      if (answer.type === "mcq" || answer.type === "truefalse") {
        // For MCQ/T-F, check if selected options match correct options
        const correctOptions = question.options
          .filter((option) => option.isCorrect)
          .map((option) => option._id.toString());

        // Sort both arrays for correct comparison
        const sortedSelected = [...answer.selectedOptions].sort();
        const sortedCorrect = [...correctOptions].sort();

        // Compare arrays for equality
        if (
          sortedSelected.length === sortedCorrect.length &&
          sortedSelected.every((value, index) => value === sortedCorrect[index])
        ) {
          score += question.points;
        }
      } else if (answer.type === "shortAnswer") {
        // For short answer, check if answer is in the list of acceptable answers (case insensitive)
        const normalizedAnswer = answer.textAnswer.trim().toLowerCase();
        const normalizedAcceptableAnswers = question.answers.map(a => 
          a.trim().toLowerCase()
        );

        if (normalizedAcceptableAnswers.includes(normalizedAnswer)) {
          score += question.points;
        }
      }
    }

    // Calculate percentage and determine if passed
    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    const passed = percentage >= examAttempt.passingScore;

    // Update exam attempt
    examAttempt.score = score;
    examAttempt.totalPoints = totalPoints;
    examAttempt.percentage = percentage;
    examAttempt.passed = passed;
    examAttempt.submittedAt = new Date();
    examAttempt.status = "graded";

    await examAttempt.save();
    
    // Update CourseProgress to reflect exam completion
    const courseProgress = await CourseProgress.findOne({
      courseID: examAttempt.courseID,
      userId: studentId,
    });
    
    if (courseProgress) {
      courseProgress.examPassed = passed;
      await courseProgress.save();
    }

    return res.status(200).json({
      success: true,
      message: "Exam submitted and graded successfully",
      result: {
        score,
        totalPoints,
        percentage,
        passed,
        passingScore: examAttempt.passingScore,
      },
    });
  } catch (error) {
    console.error("Error submitting exam:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit exam",
      error: error.message,
    });
  }
};

exports.getExamHistory = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Find all attempts for this student and course
    const attempts = await ExamAttempt.find({
      student: studentId,
      courseID: courseId,
      status: "graded",
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      attempts: attempts.map(attempt => ({
        id: attempt._id,
        submittedAt: attempt.submittedAt,
        score: attempt.score,
        totalPoints: attempt.totalPoints,
        percentage: attempt.percentage,
        passed: attempt.passed,
        passingScore: attempt.passingScore,
      }))
    });
  } catch (error) {
    console.error("Error fetching exam history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch exam history",
      error: error.message,
    });
  }
};

exports.getExamResults = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    
    // Find the most recent exam result for this user and course
    const result = await ExamResult.findOne(
      { user: userId, course: courseId },
      {},
      { sort: { createdAt: -1 } }
    ).populate("course", "exam.questions");
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: "No exam results found" 
      });
    }
    
    // Create response object with examResultId
    const resultData = {
      examResultId: result._id, // Include the ID
      scoredPoints: result.scoredPoints,
      totalPoints: result.totalPoints,
      passed: result.passed,
      percentage: Math.round((result.scoredPoints / result.totalPoints) * 100),
      reviewDetails: [],
    };
    
    // Add question review details if available
    if (result.answerDetails && result.answerDetails.length > 0) {
      resultData.reviewDetails = result.answerDetails;
    }
    
    return res.status(200).json({
      success: true,
      message: "Exam results retrieved successfully",
      result: resultData
    });
  } catch (error) {
    console.error("Error getting exam results:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to retrieve exam results" 
    });
  }
};

exports.submitExam = async (req, res) => {
  try {
    const { courseId, answers } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course || !course.exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    const { questions } = course.exam;
    let totalPoints = 0;
    let scoredPoints = 0;
    const answerDetails = [];

    questions.forEach((question) => {
      totalPoints += question.points;
      const studentAnswer = answers[question._id];
      let isCorrect = false;
      let correctAnswer = "";

      if (question.type === "mcq" || question.type === "truefalse") {
        const correctOption = question.options.find((option) => option.isCorrect);
        correctAnswer = correctOption ? correctOption.text : "";
        if (correctOption && correctOption.text === studentAnswer) {
          scoredPoints += question.points;
          isCorrect = true;
        }
      } else if (question.type === "shortAnswer") {
        correctAnswer = question.answers.join(" or ");
        if (question.answers.some(answer => 
          studentAnswer?.trim().toLowerCase() === answer.trim().toLowerCase())) {
          scoredPoints += question.points;
          isCorrect = true;
        }
      }

      // Store answer details for review
      answerDetails.push({
        question: question.question,
        questionType: question.type,
        yourAnswer: studentAnswer || "",
        correctAnswer,
        isCorrect,
        points: question.points,
        earnedPoints: isCorrect ? question.points : 0
      });
    });

    const passingScore = course.exam.passingScore;
    const passed = (scoredPoints / totalPoints) * 100 >= passingScore;

    const result = await ExamResult.create({
      user: userId,
      course: courseId,
      scoredPoints,
      totalPoints,
      passed,
      answerDetails,
      submittedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: "Exam submitted successfully",
      result: {
        examResultId: result._id, // Include this
        scoredPoints,
        totalPoints,
        passed,
        percentage: Math.round((scoredPoints / totalPoints) * 100)
      }
    });
  } catch (error) {
    console.error("Error submitting exam:", error);
    res.status(500).json({ success: false, message: "Failed to submit exam" });
  }
};