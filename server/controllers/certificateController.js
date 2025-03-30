const mongoose = require('../models/index');
// Make sure you're using the exact case as used in your model registration
const User = mongoose.model('User');  // Not 'user'
const Course = mongoose.model('Course');
const Certificate = mongoose.model('Certificate');
const ExamResult = mongoose.model('ExamResult');
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Get all certificates for a user
exports.getUserCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log("Fetching certificates for user:", userId);
    console.log("Available models:", Object.keys(mongoose.models));
    
    // Check if using the correct model name case
    const certificates = await Certificate.find({ user: userId })
      .populate({
        path: "course",
        select: "courseName instructor thumbnail",
        populate: {
          path: "instructor",
          select: "firstName lastName"
        }
      })
      .sort({ issuedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Certificates fetched successfully",
      data: certificates
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
      error: error.message
    });
  }
};

// Generate certificate PDF
exports.downloadCertificate = async (req, res) => {
  try {
    console.log("Download certificate request received");
    const { certificateId } = req.params;
    const userId = req.user.id;
    
    // Validate certificate ID
    if (!mongoose.Types.ObjectId.isValid(certificateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate ID format"
      });
    }

    // Find certificate
    const certificate = await Certificate.findById(certificateId)
      .populate({
        path: "course",
        select: "courseName instructor description thumbnail",
        populate: {
          path: "instructor",
          select: "firstName lastName"
        }
      })
      .populate("user", "firstName lastName email");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found"
      });
    }

    // Create a PDF document with explicit settings for single page
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      autoFirstPage: true,
      margin: 0,  // No margins, we'll handle padding manually
      bufferPages: true,
      info: {
        Title: `${certificate.course.courseName} Certificate`,
        Author: 'StudyNotion',
        Subject: 'Course Completion Certificate',
        Keywords: 'certificate, course, completion',
      }
    });

    // Configure response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=StudyNotion_Certificate_${certificate.user.firstName}_${certificate._id.toString().substring(0, 6)}.pdf`);
    
    // Direct pipe to response
    doc.pipe(res);

    try {
      // Get page dimensions for calculations
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const centerX = pageWidth / 2;

      // ===== CERTIFICATE DESIGN =====
      
      // 1. Page background
      doc.rect(0, 0, pageWidth, pageHeight)
         .fill('#f8fafc');
      
      // 2. Corner decorations
      doc.polygon([15, 15], [100, 15], [15, 100])
         .fill('#0f172a');
      
      doc.polygon([pageWidth-15, pageHeight-15], 
                 [pageWidth-100, pageHeight-15], 
                 [pageWidth-15, pageHeight-100])
         .fill('#0f172a');
      
      // 3. Certificate outer border
      doc.roundedRect(30, 30, pageWidth-60, pageHeight-60, 10)
         .lineWidth(3)
         .stroke('#334155');
      
      // 4. Inner decorative border
      doc.roundedRect(50, 50, pageWidth-100, pageHeight-100, 8)
         .dash(5, { space: 10 })
         .lineWidth(1)
         .stroke('#64748b');
      
      // ===== HEADER SECTION =====
      
      // 5. Platform name
      doc.font('Helvetica-Bold')
         .fontSize(28)
         .fillColor('#0369a1')
         .text('StudyNotion', centerX, 70, {
           align: 'center'
         });
      
      // 6. Decorative line under logo
      doc.moveTo(centerX - 90, 105)
         .lineTo(centerX + 90, 105)
         .lineWidth(2)
         .stroke('#0369a1');
      
      // 7. Certificate title
      doc.font('Helvetica-Bold')
         .fontSize(32)
         .fillColor('#0f172a')
         .text('CERTIFICATE OF COMPLETION', centerX, 130, {
           align: 'center'
         });
      
      // ===== MAIN CONTENT =====
      
      // 8. "This certifies that" text
      doc.font('Helvetica')
         .fontSize(16)
         .fillColor('#334155')
         .text('This certifies that', centerX, 180, {
           align: 'center'
         });
      
      // 9. Student name (major focus)
      doc.font('Helvetica-Bold')
         .fontSize(28)
         .fillColor('#0f172a')
         .text(`${certificate.user.firstName} ${certificate.user.lastName}`, centerX, 205, {
           align: 'center',
           width: pageWidth - 200  // Ensure proper wrapping for long names
         });
      
      // 10. Name underline
      doc.moveTo(centerX - 150, 245)
         .lineTo(centerX + 150, 245)
         .lineWidth(1)
         .stroke('#94a3b8');
      
      // 11. "has successfully completed" text
      doc.font('Helvetica')
         .fontSize(16)
         .fillColor('#334155')
         .text('has successfully completed the course', centerX, 265, {
           align: 'center'
         });
      
      // 12. Course name (important focus)
      doc.font('Helvetica-Bold')
         .fontSize(24)
         .fillColor('#0f172a')
         .text(certificate.course.courseName, centerX, 295, {
           align: 'center',
           width: pageWidth - 200  // Ensure proper wrapping for long course names
         });
      
      // ===== SCORE INDICATOR =====
      
      // 13. Score circle
      const scoreY = 355;
      
      // Draw circle with light fill
      doc.circle(centerX, scoreY, 30)
         .fillOpacity(0.1)
         .fill('#0ea5e9')
         .fillOpacity(1);
      
      // Circle border
      doc.circle(centerX, scoreY, 30)
         .lineWidth(2)
         .stroke('#0ea5e9');
      
      // Score percentage
      doc.font('Helvetica-Bold')
         .fontSize(18)
         .fillColor('#0369a1')
         .text(`${certificate.scorePercentage}%`, centerX, scoreY - 9, {
           align: 'center'
         });
      
      // ===== FOOTER SECTION WITH THREE COLUMNS =====
      
      const bottomSectionY = pageHeight - 130;
      
      // Column 1: Date Issued
      const leftColX = 160;
      doc.font('Helvetica')
         .fontSize(12)
         .fillColor('#64748b')
         .text('Date Issued', leftColX, bottomSectionY, {
           align: 'center',
           width: 160
         });
      
      doc.font('Helvetica-Bold')
         .fontSize(14)
         .fillColor('#0f172a')
         .text(new Date(certificate.issuedAt).toLocaleDateString('en-US', {
           year: 'numeric',
           month: 'long',
           day: 'numeric'
         }), leftColX, bottomSectionY + 20, {
           align: 'center',
           width: 160
         });
      
      // Column 2: Certificate ID
      const idBoxWidth = 180;
      const idBoxHeight = 40;
      const idBoxX = centerX - idBoxWidth/2;
      
      doc.roundedRect(idBoxX, bottomSectionY, idBoxWidth, idBoxHeight, 5)
         .fillOpacity(0.1)
         .fill('#94a3b8')
         .fillOpacity(1);
         
      doc.font('Helvetica')
         .fontSize(12)
         .fillColor('#475569')
         .text('CERTIFICATE ID', centerX, bottomSectionY + 5, {
           align: 'center'
         });
         
      doc.font('Helvetica-Bold')
         .fontSize(14)
         .fillColor('#0f172a')
         .text(certificate._id.toString().substring(0, 8).toUpperCase(), 
               centerX, bottomSectionY + 22, {
           align: 'center'
         });
      
      // Column 3: Instructor 
      const rightColX = pageWidth - 160;
      doc.font('Helvetica')
         .fontSize(12)
         .fillColor('#64748b')
         .text('Instructor', rightColX, bottomSectionY, {
           align: 'center',
           width: 160
         });
      
      // Signature line
      const signLineX = pageWidth - 160;
      const signLineWidth = 120;
      doc.moveTo(signLineX - signLineWidth/2, bottomSectionY + 35)
         .lineTo(signLineX + signLineWidth/2, bottomSectionY + 35)
         .lineWidth(1)
         .stroke('#94a3b8');
      
      // Instructor name
      doc.font('Helvetica-Bold')
         .fontSize(14)
         .fillColor('#0f172a')
         .text(`${certificate.course.instructor.firstName} ${certificate.course.instructor.lastName}`, 
               rightColX, bottomSectionY + 40, {
           align: 'center',
           width: 160
         });
      
      // ===== VERIFICATION FOOTER =====
      
      const footerY = pageHeight - 50;
      
      // Verification URL
      doc.font('Helvetica')
         .fontSize(9)
         .fillColor('#64748b')
         .text('Verify this certificate at: ', centerX, footerY, {
           align: 'center',
           continued: true
         })
         .fillColor('#0369a1')
         .text(`studynotion.com/verify/${certificate._id}`, {
           align: 'center',
           link: `https://studynotion.com/verify/${certificate._id}`,
           underline: true
         });
      
      // Copyright
      doc.font('Helvetica')
         .fontSize(8)
         .fillColor('#94a3b8')
         .text('© StudyNotion. All rights reserved.', 
              centerX, footerY + 15, {
           align: 'center'
         });

      // Log page count to verify single page
      console.log(`Certificate generated with ${doc.bufferedPageRange().count} page(s)`);
      
      // Finalize and send
      doc.end();
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: "Error generating PDF",
          error: error.message
        });
      }
    }
  } catch (error) {
    console.error("Error in downloadCertificate:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false, 
        message: "Failed to generate certificate",
        error: error.message
      });
    }
  }
};
// Verify certificate
exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    
    console.log("Verifying certificate with ID:", certificateId);
    
    if (!mongoose.Types.ObjectId.isValid(certificateId)) {
      console.log("Invalid certificate ID format");
      return res.status(400).json({
        success: false,
        message: "Invalid certificate ID format"
      });
    }

    // Get the certificate with populated fields
    const certificate = await Certificate.findById(certificateId)
      .populate({
        path: "course",
        select: "courseName instructor",
        populate: {
          path: "instructor",
          select: "firstName lastName"
        }
      })
      .populate("user", "firstName lastName");
      
    console.log("Certificate lookup result:", certificate ? "Found" : "Not Found");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found or invalid"
      });
    }

    // Check if populated fields exist
    if (!certificate.user || !certificate.course || !certificate.course.instructor) {
      console.log("Certificate has missing related data:", {
        hasUser: !!certificate.user,
        hasCourse: !!certificate.course,
        hasInstructor: certificate.course ? !!certificate.course.instructor : false
      });
      
      return res.status(404).json({
        success: false,
        message: "Certificate data is incomplete"
      });
    }

    // Format the certificate data for the frontend
    const certificateData = {
      _id: certificate._id,
      courseName: certificate.course.courseName,
      userName: `${certificate.user.firstName} ${certificate.user.lastName}`,
      instructorName: `${certificate.course.instructor.firstName} ${certificate.course.instructor.lastName}`,
      issuedAt: certificate.issuedAt,
      scorePercentage: certificate.scorePercentage,
      verified: true
    };

    console.log("Certificate verification successful, returning data");
    
    return res.status(200).json({
      success: true,
      message: "Certificate verified successfully",
      data: certificateData
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify certificate",
      error: error.message
    });
  }
};

// Generate certificate from exam result
exports.generateCertificate = async (req, res) => {
  try {
    const { examResultId } = req.body;
    const userId = req.user.id;
    
    console.log("Generating certificate for exam result ID:", examResultId, "User ID:", userId);
    
    if (!mongoose.Types.ObjectId.isValid(examResultId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam result ID format"
      });
    }

    // Get the exam result
    const examResult = await ExamResult.findById(examResultId);
    if (!examResult) {
      return res.status(404).json({
        success: false,
        message: "Exam result not found"
      });
    }

    // Check user permission
    if (examResult.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to generate this certificate"
      });
    }

    // Check if exam was passed
    if (!examResult.passed) {
      return res.status(400).json({
        success: false,
        message: "Certificate can only be generated for passed exams"
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      user: userId,
      course: examResult.course
    });

    if (existingCertificate) {
      console.log("Certificate already exists, returning existing certificate");
      
      // Return the existing certificate
      const populatedCertificate = await Certificate.findById(existingCertificate._id)
        .populate({
          path: "course",
          select: "courseName instructor",
          populate: {
            path: "instructor",
            select: "firstName lastName"
          }
        })
        .populate("user", "firstName lastName");
        
      return res.status(200).json({
        success: true,
        message: "Certificate already exists",
        data: populatedCertificate
      });
    }

    // Calculate percentage score
    const scorePercentage = Math.round((examResult.scoredPoints / examResult.totalPoints) * 100);

    // Create new certificate
    const certificate = await Certificate.create({
      user: userId,
      course: examResult.course,
      scorePercentage,
      issuedAt: new Date()
    });

    // Return certificate data
    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate({
        path: "course",
        select: "courseName instructor",
        populate: {
          path: "instructor",
          select: "firstName lastName"
        }
      })
      .populate("user", "firstName lastName");

    console.log("Certificate generated successfully");
    
    return res.status(201).json({
      success: true,
      message: "Certificate generated successfully",
      data: populatedCertificate
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate certificate",
      error: error.message
    });
  }
};