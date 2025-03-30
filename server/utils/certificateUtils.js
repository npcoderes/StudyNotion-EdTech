const PDFDocument = require("pdfkit");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const QRCode = require('qrcode');
const crypto = require('crypto');

/**
 * Generates a professional course completion certificate
 * @param {Object} options - Certificate generation options
 * @param {Object} options.user - User information
 * @param {Object} options.course - Course information
 * @param {String} options.filePath - Output file path
 * @returns {Promise<String>} Certificate ID
 */
exports.generateCertificate = async ({ user, course, filePath }) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Create a unique certificate ID and verification hash
            const certificateId = uuidv4().slice(0, 8).toUpperCase();
            const verificationHash = crypto.createHash('sha256')
                .update(`${certificateId}-${user._id}-${course._id}`)
                .digest('hex')
                .substring(0, 12);
                
            // Create temporary QR code file
            const qrCodePath = path.join(path.dirname(filePath), `qr_temp_${certificateId}.png`);
            const verificationUrl = `https://studynotion.com/verify/${certificateId}/${verificationHash}`;
            
            // Generate QR code for certificate verification
            await QRCode.toFile(qrCodePath, verificationUrl, {
                errorCorrectionLevel: 'H',
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });

            // Create document with higher quality rendering
            const doc = new PDFDocument({
                size: [842, 595], // A4 Landscape
                margin: 0,
                bufferPages: true,
                info: {
                    Title: `${course.courseName} - Certificate of Completion`,
                    Author: 'StudyNotion',
                    Subject: 'Course Completion Certificate',
                    Keywords: 'education, certificate, completion, online learning',
                    CreationDate: new Date(),
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
            const sealPath = path.join(assetsPath, 'seal.png');
            const watermarkPath = path.join(assetsPath, 'watermark.png');

            // Colors and styling constants
            const colors = {
                primary: '#1F2937',     // Dark blue/gray for main text
                secondary: '#4B5563',   // Medium gray for secondary text
                accent: '#FFD60A',      // Yellow for accents
                accentSoft: '#FFF3B0',  // Soft yellow for backgrounds
                border: '#D1D5DB',      // Light gray for borders
                borderAccent: '#FFD60A', // Yellow for accent borders
                background: '#FFFFFF',  // White background
                ribbon: '#1F2937',      // Dark ribbon color
            };

            // Setup clean white background
            doc.rect(0, 0, doc.page.width, doc.page.height).fill(colors.background);

            // Add subtle watermark (if exists)
            try {
                if (fs.existsSync(watermarkPath)) {
                    doc.image(watermarkPath, 0, 0, {
                        width: doc.page.width,
                        height: doc.page.height,
                        opacity: 0.04
                    });
                }
            } catch (error) {
                console.warn('Watermark loading failed:', error);
            }

            // Add decorative accent elements along left and right edges
            const accentBarWidth = 10;
            doc.rect(0, 0, accentBarWidth, doc.page.height).fill(colors.accent);
            doc.rect(doc.page.width - accentBarWidth, 0, accentBarWidth, doc.page.height).fill(colors.accent);

            // Draw elegant border
            const borderMargin = 20;
            
            // Outer border
            doc.rect(
                borderMargin, 
                borderMargin, 
                doc.page.width - (borderMargin * 2), 
                doc.page.height - (borderMargin * 2)
            )
            .lineWidth(1.5)
            .stroke(colors.border);
            
            // Inner border with corner decorations
            const innerMargin = borderMargin + 10;
            doc.rect(
                innerMargin, 
                innerMargin, 
                doc.page.width - (innerMargin * 2), 
                doc.page.height - (innerMargin * 2)
            )
            .lineWidth(0.5)
            .stroke(colors.border);
            
            // Corner decorations (small squares)
            const decorSize = 8;
            const cornerPos = [
                [innerMargin - decorSize/2, innerMargin - decorSize/2],
                [doc.page.width - innerMargin - decorSize/2, innerMargin - decorSize/2],
                [innerMargin - decorSize/2, doc.page.height - innerMargin - decorSize/2],
                [doc.page.width - innerMargin - decorSize/2, doc.page.height - innerMargin - decorSize/2]
            ];
            
            cornerPos.forEach(pos => {
                doc.rect(pos[0], pos[1], decorSize, decorSize).fill(colors.accent);
            });

            // Logo placement
            try {
                doc.image(logoPath, doc.page.width / 2 - 55, 35, { 
                    width: 110,
                    align: 'center'
                });
            } catch (error) {
                console.warn('Logo loading failed:', error);
                // Fallback to text if logo doesn't load
                doc.font('Helvetica-Bold')
                   .fontSize(20)
                   .fillColor(colors.primary)
                   .text('STUDYNOTION', doc.page.width / 2 - 80, 40);
            }

            // Certificate title ribbon
            const ribbonY = 120;
            const ribbonHeight = 44;
            
            doc.polygon(
                [innerMargin - 5, ribbonY],
                [doc.page.width - innerMargin + 5, ribbonY],
                [doc.page.width - innerMargin + 5, ribbonY + ribbonHeight],
                [innerMargin - 5, ribbonY + ribbonHeight]
            )
            .fill(colors.ribbon)
            .opacity(0.9);

            // Certificate title
            doc.opacity(1) // Reset opacity
                .font('Helvetica-Bold')
                .fontSize(28)
                .fillColor('#FFFFFF')
                .text('CERTIFICATE OF COMPLETION', 0, ribbonY + 10, { align: 'center' });

            // Certificate content
            doc.font('Helvetica')
                .fontSize(14)
                .fillColor(colors.secondary)
                .text('This is to certify that', 0, ribbonY + 65, { align: 'center' })
                .moveDown(0.3);

            // Recipient name with elegant styling
            doc.font('Helvetica-Bold')
                .fontSize(32)
                .fillColor(colors.primary)
                .text(`${user.firstName} ${user.lastName}`, 0, doc.y, { align: 'center' })
                .moveDown(0.5);

            // Add decorative underline for name
            const nameWidth = doc.widthOfString(`${user.firstName} ${user.lastName}`);
            const underlineStart = (doc.page.width - nameWidth) / 2 + 40;
            const underlineEnd = doc.page.width - underlineStart;
            
            doc.moveTo(underlineStart, doc.y - 10)
               .lineTo(underlineEnd, doc.y - 10)
               .lineWidth(1)
               .stroke(colors.accent);

            // Course completion text
            doc.font('Helvetica')
                .fontSize(14)
                .fillColor(colors.secondary)
                .text('has successfully completed the course', 0, doc.y + 15, { align: 'center' })
                .moveDown(0.5);

            // Course name with styling
            doc.font('Helvetica-Bold')
                .fontSize(24)
                .fillColor(colors.primary)
                .text(course.courseName, 0, doc.y, { align: 'center' })
                .moveDown(0.3);
                
            // Add course duration or other details if available
            if (course.duration) {
                doc.font('Helvetica')
                    .fontSize(12)
                    .fillColor(colors.secondary)
                    .text(`Duration: ${course.duration}`, 0, doc.y, { align: 'center' })
                    .moveDown(0.3);
            }

            // Issue date in a nicer format
            const issueDate = new Date();
            const formattedDate = issueDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            });

            doc.font('Helvetica')
                .fontSize(12)
                .fillColor(colors.secondary)
                .text(`Awarded on ${formattedDate}`, 0, doc.y + 10, { align: 'center' })
                .moveDown(2);

            // Signature section
            const signatureY = 405;
            const signatureWidth = 100;
            
            // Add signature with error handling
            try {
                doc.image(signaturePath, doc.page.width / 2 - signatureWidth / 2, signatureY, { width: signatureWidth });
            } catch (error) {
                console.warn('Signature loading failed:', error);
                // Draw a placeholder line instead
                doc.moveTo(doc.page.width / 2 - 50, signatureY + 40)
                   .lineTo(doc.page.width / 2 + 50, signatureY + 40)
                   .lineWidth(1)
                   .stroke(colors.primary);
            }

            // Add signature line and title
            doc.moveTo(doc.page.width / 2 - 70, signatureY + 60)
               .lineTo(doc.page.width / 2 + 70, signatureY + 60)
               .lineWidth(0.5)
               .stroke(colors.border);

            doc.fontSize(10)
               .font('Helvetica')
               .fillColor(colors.secondary)
               .text('Course Instructor', doc.page.width / 2, signatureY + 65, { align: 'center' });

            // Add instructor name if available
            if (course.instructor && course.instructor.name) {
                doc.fontSize(12)
                   .font('Helvetica-Bold')
                   .text(course.instructor.name, doc.page.width / 2, signatureY + 80, { align: 'center' });
            }

            // Add certificate seal on the right
            try {
                if (fs.existsSync(sealPath)) {
                    doc.image(sealPath, doc.page.width - 150, signatureY - 10, { width: 80 });
                }
            } catch (error) {
                console.warn('Seal image loading failed:', error);
            }

            // Add QR code for verification
            try {
                doc.image(qrCodePath, 70, signatureY - 10, { width: 80 });
                
                doc.fontSize(9)
                   .font('Helvetica')
                   .fillColor(colors.secondary)
                   .text('Scan to verify', 70, signatureY + 75, { width: 80, align: 'center' });
            } catch (error) {
                console.warn('QR code loading failed:', error);
            }

            // Certificate verification details
            doc.fontSize(9)
               .font('Helvetica')
               .fillColor(colors.secondary)
               .text(`Certificate ID: ${certificateId}`, 70, doc.page.height - 70);
               
            doc.fontSize(9)
               .text(`Verification: ${verificationHash}`, 70, doc.page.height - 60);

            // StudyNotion footer
            doc.fontSize(10)
               .font('Helvetica-Bold')
               .fillColor(colors.primary)
               .text('StudyNotion', doc.page.width - 120, doc.page.height - 70)
               
            doc.fontSize(8)
               .font('Helvetica')
               .fillColor(colors.secondary)
               .text('An EdTech Platform by Learners', doc.page.width - 170, doc.page.height - 60);

            // Finalize document
            doc.end();

            // Handle stream completion and cleanup
            stream.on('finish', () => {
                // Delete temporary QR code file
                try {
                    fs.unlinkSync(qrCodePath);
                } catch (error) {
                    console.warn('Failed to delete temporary QR code file:', error);
                }
                
                resolve(certificateId);
            });

        } catch (error) {
            reject(error);
        }
    });
};