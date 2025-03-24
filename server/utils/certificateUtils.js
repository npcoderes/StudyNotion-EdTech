const PDFDocument = require("pdfkit");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const path = require('path');

exports.generateCertificate = async ({ user, course, filePath }) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Create document
            const doc = new PDFDocument({
                size: [842, 595], // A4 Landscape
                margin: 0,
                info: {
                    Title: `Certificate - ${course.courseName}`,
                    Author: 'StudyNotion',
                    Subject: 'Course Completion Certificate',
                }
            });

            // Handle errors
            doc.on('error', reject);

            // Stream setup with error handling
            const stream = fs.createWriteStream(filePath);
            stream.on('error', reject);
            doc.pipe(stream);

            // Assets paths
            const assetsPath = path.join(__dirname, '../assets');
            const logoPath = path.join(assetsPath, 'logo.png');
            const signaturePath = path.join(assetsPath, 'signature.png');

            // Verify assets exist
            if (!fs.existsSync(logoPath) || !fs.existsSync(signaturePath)) {
                throw new Error('Required assets not found');
            }

            // Colors and constants
            const colors = {
                primary: '#1F2937',
                secondary: '#4B5563',
                accent: '#FFD60A',
                border: '#E5E7EB',
                background: '#F3F4F6',
                pattern: '#D3D3D3' // Changed to accent color for better visibility
            };

            const certificateId = uuidv4().slice(0, 8).toUpperCase();

            // Background color
            doc
                .rect(0, 0, doc.page.width, doc.page.height)
                .fill(colors.background);

            // Generate a pattern programmatically
            const patternSize = 20; // Size of each pattern tile
            const patternSpacing = 5; // Spacing between pattern elements
            const patternOpacity = 0.1; // Reduced opacity for better look with new color

            doc.save();
            doc.opacity(patternOpacity); // Set opacity for the pattern

            for (let x = 0; x < doc.page.width; x += patternSize + patternSpacing) {
                for (let y = 0; y < doc.page.height; y += patternSize + patternSpacing) {
                    // Draw a circle (dot) as the pattern
                    doc
                        .circle(x + patternSize / 2, y + patternSize / 2, patternSize / 4)
                        .fill(colors.pattern);
                }
            }

            doc.restore(); // Restore original opacity

            // Enhanced border with double lines
            const outerBorder = 15;
            const innerBorder = 20;

            doc
                .rect(outerBorder, outerBorder, doc.page.width - (outerBorder * 2), doc.page.height - (outerBorder * 2))
                .lineWidth(1)
                .stroke(colors.border);

            doc
                .rect(innerBorder, innerBorder, doc.page.width - (innerBorder * 2), doc.page.height - (innerBorder * 2))
                .lineWidth(0.5)
                .stroke(colors.border);

            // Logo with error handling - increased size
            try {
                doc.image(logoPath, 
                    doc.page.width / 2 - 60, // Adjusted x position for centering
                    40, // Moved slightly higher
                    { 
                        width: 120 // Increased from 80 to 120
                    }
                );
            } catch (error) {
                console.warn('Logo loading failed:', error);
            }

            // Adjusted the text position to accommodate larger logo
            doc
                .font('Helvetica-Bold')
                .fontSize(36)
                .fillColor(colors.primary)
                .text('CERTIFICATE OF COMPLETION', 0, 170, { align: 'center' });

            // Recipient
            doc
                .font('Helvetica')
                .fontSize(16)
                .fillColor(colors.secondary)
                .text('This is to certify that', 0, 220, { align: 'center' })
                .moveDown(0.5);

            doc
                .font('Helvetica-Bold')
                .fontSize(28)
                .fillColor(colors.primary)
                .text(`${user.firstName} ${user.lastName}`, { align: 'center' })
                .moveDown(0.5);

            // Course details
            doc
                .font('Helvetica')
                .fontSize(16)
                .fillColor(colors.secondary)
                .text('has successfully completed the course', { align: 'center' })
                .moveDown(0.5);

            doc
                .font('Helvetica-Bold')
                .fontSize(24)
                .fillColor(colors.primary)
                .text(`${course.courseName}`, { align: 'center' })
                .moveDown(2);

            // Date and certificate number
            doc
                .font('Helvetica')
                .fontSize(12)
                .text(`Date: ${new Date().toLocaleDateString()}`, 100, 450)
                .text(`Certificate ID: ${certificateId}`, doc.page.width - 250, 450);

            // Add signature with error handling
            try {
                doc.image(signaturePath, doc.page.width / 2 - 50, 380, { width: 100 });
            } catch (error) {
                console.warn('Signature loading failed:', error);
            }

            // Finalize document
            doc.end();

            // Handle stream completion
            stream.on('finish', () => {
                resolve(certificateId);
            });

        } catch (error) {
            reject(error);
        }
    });
};