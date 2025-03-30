const express = require("express");
const router = express.Router();
const { auth, authWithQueryToken } = require("../middleware/auth");
const { 
  getUserCertificates,
  downloadCertificate,
  verifyCertificate,
  generateCertificate
} = require("../controllers/certificateController");
const PDFDocument = require("pdfkit"); // Import PDFKit

// User certificates list
router.get("/user", auth, getUserCertificates);

// Download certificate - with query token support
router.get("/download/:certificateId", authWithQueryToken, downloadCertificate);

// Verify certificate (public route)
router.get("/verify/:certificateId", verifyCertificate);

// Generate certificate
router.post("/generate", auth, generateCertificate);

// Add this route for testing
router.get("/test-pdf", (req, res) => {
  try {
    // Create a simple PDF document
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=test.pdf');
    
    // Pipe the PDF to the response
    doc.pipe(res);
    
    // Add some content
    doc.fontSize(25).text('Testing PDF Generation', 100, 100);
    
    // Add a colored rectangle
    doc.rect(100, 150, 100, 100)
       .fillAndStroke('red', '#900');
       
    // End the document
    doc.end();
  } catch (error) {
    console.error("Error generating test PDF:", error);
    res.status(500).json({
      success: false,
      message: "Error generating test PDF",
      error: error.message
    });
  }
});

module.exports = router;