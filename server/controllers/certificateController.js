const mongoose = require('../models/indexModal');
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
      margin: 0,
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

      // 1. Solid white background first (no opacity issues)
      doc.rect(0, 0, pageWidth, pageHeight)
        .fillColor('#ffffff')
        .fill();

      // Add a subtle pattern background
      for (let i = 0; i < pageWidth; i += 20) {
        for (let j = 0; j < pageHeight; j += 20) {
          doc.circle(i, j, 0.5)
            .fillColor('#422FAF')
            .fillOpacity(0.05)
            .fill();
        }
      }

      // Reset opacity after pattern
      doc.fillOpacity(1);

      // 2. Elegant corner decorations
      // Top-left corner
      doc.polygon([15, 15], [150, 15], [15, 150])
        .fillColor('#422FAF')
        .fill();

      // Bottom-right corner
      doc.polygon([pageWidth - 15, pageHeight - 15],
        [pageWidth - 150, pageHeight - 15],
        [pageWidth - 15, pageHeight - 150])
        .fillColor('#422FAF')
        .fill();

      // 3. Certificate outer border with shadow effect
      // Shadow effect first
      doc.roundedRect(35, 35, pageWidth - 70, pageHeight - 70, 10)
        .fillColor('#000000')
        .fillOpacity(0.05)
        .fill();

      // Reset opacity after shadow 
      doc.fillOpacity(1);

      // Main border
      doc.roundedRect(30, 30, pageWidth - 60, pageHeight - 60, 10)
        .lineWidth(3)
        .strokeColor('#422FAF')
        .stroke();

      // 4. Inner decorative border with custom dash pattern
      doc.roundedRect(50, 50, pageWidth - 100, pageHeight - 100, 8)
        .dash(5, { space: 10 })
        .lineWidth(1.5)
        .strokeColor('#422FAF')
        .strokeOpacity(0.6)
        .stroke();

      // Reset dash pattern and opacity
      doc.undash();
      doc.strokeOpacity(1);

      // ===== HEADER SECTION =====

      // 5. Platform logo/name with enhanced styling
      const headerY = 70;
      doc.font('Helvetica-Bold')
        .fontSize(38)
        .fillColor('#422FAF')
        .text('StudyNotion', 0, headerY, {
          align: 'center',
          width: pageWidth
        });

      // 6. Decorative elements under logo
      const lineY = headerY + 45;
      doc.moveTo(centerX - 120, lineY)
        .lineTo(centerX + 120, lineY)
        .lineWidth(2)
        .strokeColor('#422FAF')
        .stroke();

      // Add small decorative elements to the line
      doc.circle(centerX, lineY, 4)
        .fillColor('#422FAF')
        .fill();
      doc.circle(centerX - 120, lineY, 2.5)
        .fillColor('#422FAF')
        .fill();
      doc.circle(centerX + 120, lineY, 2.5)
        .fillColor('#422FAF')
        .fill();

      // 7. Certificate title - combined in one text element for better spacing
      doc.font('Helvetica-Bold')
        .fontSize(42)
        .fillColor('#1E293B')
        .text('CERTIFICATE OF', 0, lineY + 35, {
          align: 'center',
          width: pageWidth
        });

      doc.font('Helvetica-Bold')
        .fontSize(42)
        .fillColor('#1E293B')
        .text('COMPLETION', 0, lineY + 85, {
          align: 'center',
          width: pageWidth
        });

      // ===== MAIN CONTENT =====

      // Calculate text position from the top to ensure consistent layout
      const mainContentY = lineY + 150; // Start of main content section

      // 8. "This certifies that" text
      doc.font('Helvetica')
        .fontSize(18)
        .fillColor('#334155')
        .text('This certifies that', 0, mainContentY, {
          align: 'center',
          width: pageWidth
        });

      // 9. Student name (major focus)
      const nameY = mainContentY + 40;
      const studentName = `${certificate.user.firstName} ${certificate.user.lastName}`;

      doc.font('Helvetica-Bold')
        .fontSize(32)
        .fillColor('#0F172A')
        .text(studentName, 0, nameY, {
          align: 'center',
          width: pageWidth
        });

      // 10. Decorative name underline
      const nameWidth = doc.widthOfString(studentName);
      const underlineWidth = Math.min(400, Math.max(250, nameWidth + 60));
      const underlineY = nameY + 45;

      doc.moveTo(centerX - underlineWidth / 2, underlineY)
        .lineTo(centerX + underlineWidth / 2, underlineY)
        .lineWidth(1.5)
        .strokeColor('#94A3B8')
        .stroke();

      // 11. "has successfully completed" text
      const completedTextY = underlineY + 30;
      doc.font('Helvetica')
        .fontSize(18)
        .fillColor('#334155')
        .text('has successfully completed the course', 0, completedTextY, {
          align: 'center',
          width: pageWidth
        });

      // 12. Course name
      const courseNameY = completedTextY + 40;
      doc.font('Helvetica-Bold')
        .fontSize(28)
        .fillColor('#0F172A')
        .text(certificate.course.courseName, 0, courseNameY, {
          align: 'center',
          width: pageWidth
        });

      // ===== SCORE INDICATOR =====

      // 13. Score circle
      const scoreY = courseNameY + 90;

      // Draw outer circle
      doc.circle(centerX, scoreY, 40)
        .strokeColor('#422FAF')
        .lineWidth(2.5)
        .stroke();

      // Fill inner circle with light color
      doc.circle(centerX, scoreY, 38)
        .fillColor('#422FAF')
        .fillOpacity(0.08)
        .fill();

      // Reset opacity
      doc.fillOpacity(1);

      // Score percentage
      doc.font('Helvetica-Bold')
        .fontSize(28)
        .fillColor('#422FAF')
        .text(`${certificate.scorePercentage}%`, 0, scoreY - 15, {
          align: 'center',
          width: pageWidth
        });

      // "Score" label
      doc.font('Helvetica')
        .fontSize(14)
        .fillColor('#475569')
        .text('SCORE', 0, scoreY + 15, {
          align: 'center',
          width: pageWidth
        });

      // ===== FOOTER SECTION WITH THREE COLUMNS =====

      const bottomSectionY = pageHeight - 140;

      // ----- Column 1: Date Issued -----
      const leftColX = 80;
      doc.font('Helvetica')
        .fontSize(12)
        .fillColor('#475569')
        .text('DATE ISSUED', leftColX, bottomSectionY, {
          align: 'center',
          width: 160
        });

      const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      doc.font('Helvetica-Bold')
        .fontSize(14)
        .fillColor('#1E293B')
        .text(formattedDate, leftColX, bottomSectionY + 20, {
          align: 'center',
          width: 160
        });

      // ----- Column 2: Certificate ID -----
      const idBoxWidth = 180;
      const idBoxHeight = 45;
      const idBoxX = centerX - idBoxWidth / 2;

      doc.roundedRect(idBoxX, bottomSectionY - 5, idBoxWidth, idBoxHeight, 8)
        .fillColor('#422FAF')
        .fillOpacity(0.08)
        .fill();

      // Reset fill opacity
      doc.fillOpacity(1);

      doc.font('Helvetica')
        .fontSize(12)
        .fillColor('#334155')
        .text('CERTIFICATE ID', centerX, bottomSectionY + 5, {
          align: 'center'
        });

      const formattedID = certificate._id.toString().substring(0, 8).toUpperCase();

      doc.font('Helvetica-Bold')
        .fontSize(16)
        .fillColor('#1E293B')
        .text(formattedID, centerX, bottomSectionY + 22, {
          align: 'center'
        });

      // ----- Column 3: Instructor -----
      const rightColX = 0 - 240;
      doc.font('Helvetica')
        .fontSize(12)
        .fillColor('#475569')
        .text('INSTRUCTOR', rightColX, bottomSectionY, {
          align: 'center',
          width: 160
        });

      // Signature Line
      const signLineWidth = 130;
      doc.moveTo(rightColX + 15, bottomSectionY + 35)
        .lineTo(rightColX + 15 + signLineWidth, bottomSectionY + 35)
        .lineWidth(1.5)
        .strokeColor('#94A3B8')
        .stroke();

      const instructorName = `${certificate.course.instructor.firstName} ${certificate.course.instructor.lastName}`;

      doc.font('Helvetica-Bold')
        .fontSize(14)
        .fillColor('#1E293B')
        .text(instructorName, rightColX, bottomSectionY + 40, {
          align: 'center',
          width: 160
        });

      // ===== VERIFICATION FOOTER =====

      const footerY = pageHeight - 55;

      doc.font('Helvetica')
        .fontSize(10)
        .fillColor('#475569')
        .text('Verify this certificate at:', centerX, footerY, {
          align: 'center'
        });

      doc.fillColor('#422FAF')
        .text(`studynotion.com/verify/${certificate._id}`, {
          align: 'center',
          link: `https://studynotion.com/verify/${certificate._id}`,
          underline: true
        });

      doc.font('Helvetica')
        .fontSize(9)
        .fillColor('#64748B')
        .text('© StudyNotion Education Pvt Ltd. All rights reserved.', centerX, footerY + 20, {
          align: 'center'
        });

      // Finalize the document
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