const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")
const {convertSecondsToDuration} = require("../utils/secToDuration")
const { generateCertificate } = require("../utils/certificateUtils"); // Utility for certificate generation
const mailSender = require("../utils/mailSender")
const {uploadImageToCloudinary, uploadPdfToCloudinary} = require("../utils/imageUploader")
const User = require("../models/User")
const path = require("path")
const ExamAttempt = require("../models/ExamAttempt") // Added for exam attempt model

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body;
  const userId = req.user.id;

  try {
    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" });
    }

    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress does not exist",
      });
    }

    // Check if the subsection is already completed
    if (courseProgress.completedVideos.includes(subsectionId)) {
      return res.status(400).json({ error: "Subsection already completed" });
    }

    // Push the subsection into the completedVideos array
    courseProgress.completedVideos.push(subsectionId);
    await courseProgress.save();

    // Check if the course is now complete
    const course = await Course.findById(courseId).populate("courseContent");
    const totalLectures = course.courseContent.reduce(
      (acc, section) => acc + section.subSection.length,
      0
    );

    if (courseProgress.completedVideos.length === totalLectures) {
      // Content is complete, check exam requirements
      courseProgress.contentCompleted = true;
      await courseProgress.save();
      
      // Check if the course has an exam and if it's been passed
      if (course.hasExam) {
        const passedExam = await ExamAttempt.findOne({
          student: userId,
          courseID: courseId,
          passed: true,
          status: "graded"
        });
        
        if (!passedExam) {
          // Content completed but exam not passed
          return res.status(200).json({ 
            message: "Course content completed, but exam must be passed to get certificate",
            contentCompleted: true,
            examPassed: false 
          });
        }
        
        // Exam passed, update course progress
        courseProgress.examPassed = true;
        await courseProgress.save();
      }
      
      // Generate certificate - content complete and exam passed (if required)
      const certificatePath = path.join(
        __dirname,
        `../certificates/${userId}_${courseId}.pdf`
      );

      let user = await User.findById(userId);

      await generateCertificate({
        user: user, 
        course,
        filePath: certificatePath,
      });

      // upload certificatePath to cloudinary and get the url
      const certificateImage = await uploadPdfToCloudinary(
        certificatePath, 
        process.env.FOLDER_NAME, 
        600, 
        100
      );
      
      // Save certificate URL in the database
      courseProgress.certificateURL = certificateImage.secure_url;
      await courseProgress.save();

      return res.status(200).json({
        message: "Course progress updated and certificate generated",
        certificateURL: certificateImage.secure_url,
      });
    }

    return res.status(200).json({ message: "Course progress updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error........."+error });
  }
};

exports.getProgressPercentage = async (req, res) => {
  const { courseId } = req.body
  const userId = req.user.id

  if (!courseId) {
    return res.status(400).json({ error: "Course ID not provided." })
  }

  try {
    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })
      .populate({
        path: "courseID",
        populate: {
          path: "courseContent",
        },
      })
      .exec()

    if (!courseProgress) {
      return res
        .status(400)
        .json({ error: "Can not find Course Progress with these IDs." })
    }
    // console.log(courseProgress, userId)
    let lectures = 0
    courseProgress.courseID.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })

    let progressPercentage =
      (courseProgress.completedVideos.length / lectures) * 100

    // To make it up to 2 decimal point
    const multiplier = Math.pow(10, 2)
    progressPercentage =
      Math.round(progressPercentage * multiplier) / multiplier

    return res.status(200).json({
      data: progressPercentage,
      message: "Succesfully fetched Course progress",
    })
  } catch (error) {
    // console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

exports.checkCourseCompleted = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ error: "Course ID not provided." });
    }

    const courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      return res.status(400).json({ 
        error: "Can not find Course Progress with these IDs." 
      });
    }

    const course = await Course.findById(courseId).populate("courseContent");
    
    // Calculate content completion
    const totalLectures = course.courseContent.reduce(
      (acc, section) => acc + section.subSection.length,
      0
    );
    const contentCompleted = courseProgress.completedVideos.length === totalLectures;
    
    // Check exam requirement
    let examRequirementMet = true; // Default to true if no exam
    let examAttempted = false;
    
    if (course.hasExam) {
      // Check if the student has attempted the exam
      const examAttempt = await ExamAttempt.findOne({
        student: userId,
        courseID: courseId,
        status: "graded"
      });
      
      examAttempted = !!examAttempt;
      examRequirementMet = examAttempt?.passed || false;
    }
    
    // Update course progress status
    courseProgress.contentCompleted = contentCompleted;
    courseProgress.examPassed = examRequirementMet;
    await courseProgress.save();
    
    // Determine if course is fully completed and certificate is available
    const isFullyCompleted = contentCompleted && examRequirementMet;
    
    return res.status(200).json({ 
      success: true,
      contentCompleted,
      examPassed: examRequirementMet,
      examAttempted,
      requiresExam: course.hasExam,
      isFullyCompleted,
      certificateURL: isFullyCompleted ? courseProgress.certificateURL : null,
      message: isFullyCompleted ? "Course Completed" : "Course Not Completed" 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};





