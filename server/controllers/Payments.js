const Rajorpay = require('razorpay');
const instance = require('../config/razorpay');
const crypto = require('crypto');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');
require('dotenv').config();

const User = require('../models/User');
const Course = require('../models/Course');
const CourseProgress = require("../models/CourseProgress")
const Invoice = require("../models/Invoice"); // Ensure the correct path to the Invoice model

const { default: mongoose } = require('mongoose')


// ================ capture the payment and Initiate the 'Rajorpay order' ================
exports.capturePayment = async (req, res) => {

    // extract courseId & userId
    const { coursesId } = req.body;
    // console.log('coursesId = ', typeof (coursesId))
    // console.log('coursesId = ', coursesId)
    const courses = coursesId.flat()

    const userId = req.user.id;


    if (coursesId.length === 0) {
        return res.json({ success: false, message: "Please provide Course Id" });
    }
    console.log(coursesId.length)
    let totalAmount = 0;

    for (const course_id of courses) {
        let course;
        try {
            // valid course Details
            // console.log("course_id........... = ", course_id)
            const courseId = new mongoose.Types.ObjectId(course_id); // Convert to ObjectId
            // console.log("courseId________________ = ", courseId)
            course = await Course.findById(courseId); // Use the converted ObjectId
            if (!course) {
                return res.status(404).json({ success: false, message: "Could not find the course" });
            }

            // check user already enrolled the course
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(400).json({ success: false, message: "Student is already Enrolled" });
            }

            totalAmount += course.price;
            // console.log(totalAmount)
        }
        catch (error) {
            // console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // create order
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    // initiate payment using Rajorpay
    try {
        const paymentResponse = await instance.instance.orders.create(options);
        // return response
        res.status(200).json({
            success: true,
            message: paymentResponse,
        })
    }
    catch (error) {
        // console.log(error);
        return res.status(500).json({ success: false, mesage: "Could not Initiate Order" });
    }

}



// ================ verify the payment ================
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.coursesId;
    const userId = req.user.id;
    // console.log(' req.body === ', req.body)

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        return res.status(400).json({ success: false, message: "Payment Failed, data not found" });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {


        //enroll student and create invoice
        await enrollStudentsAndCreateInvoice(courses, userId, razorpay_payment_id, res);
        //return res
        return res.status(200).json({ success: true, message: "Payment Verified" });
    }
    return res.status(200).json({ success: "false", message: "Payment Failed" });

}


// ================ enroll Students to course after payment ================
const enrollStudentsAndCreateInvoice = async (courses, userId, paymentId, res) => {
    if (!courses || !userId) {
        return res.status(400).json({ success: false, message: "Please provide data for courses or userId" });
    }

    const coursesId = courses.flat();

    for (const courseid of coursesId) {
        try {
            const courseId = new mongoose.Types.ObjectId(courseid);

            // Find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true }
            );

            if (!enrolledCourse) {
                return res.status(500).json({ success: false, message: "Course not found" });
            }

            // Initialize course progress with 0 percent
            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
                expireTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),         //1 year from now
            });

            // Find the student and add the course to their list of enrolled courses
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id,
                    },
                },
                { new: true }
            );

            if (!enrolledStudent) {
                return res.status(500).json({ success: false, message: "User not found" });
            }

            // Distribute revenue
            const coursePrice = enrolledCourse.price;
            const instructorRevenue = (coursePrice * 80) / 100; // 80% to instructor
            const adminRevenue = (coursePrice * 20) / 100; // 20% to admin

            // Update instructor's revenue
            const updatedInstructor = await User.findByIdAndUpdate(
                enrolledCourse.instructor, // Assuming the course has an `instructor` field
                { $inc: { Revenue: instructorRevenue } },
                { new: true }
            );

            if (!updatedInstructor) {
                return res.status(500).json({ success: false, message: "Instructor not found" });
            }

            // Update admin's revenue
            const updatedAdmin = await User.findOneAndUpdate(
                { accountType: "Admin" }, // Assuming there is one admin user
                { $inc: { Revenue: adminRevenue } },
                { new: true }
            );

            if (!updatedAdmin) {
                return res.status(500).json({ success: false, message: "Admin not found" });
            }

            // Create an invoice for the payment
            const invoice = await Invoice.create({
                user: userId,
                course: courseId,
                amount: coursePrice,
                paymentMethod: "UPI", // Assuming UPI as the default payment method
                paymentId: paymentId,
            });

            console.log("Invoice created: ", invoice);

            // Send an email notification to the enrolled student
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
            );
            console.log("Email sent successfully", emailResponse);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};



exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;

    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    try {
        // find student
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`,
                amount / 100, orderId, paymentId)
        )
    }
    catch (error) {
        // console.log("error in sending mail", error)
        return res.status(500).json({ success: false, message: "Could not send email" })
    }
}


// ================ verify Signature ================
// exports.verifySignature = async (req, res) => {
//     const webhookSecret = '12345678';

//     const signature = req.headers['x-rajorpay-signature'];

//     const shasum = crypto.createHmac('sha256', webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest('hex');


//     if (signature === digest) {
//         console.log('Payment is Authorized');

//         const { courseId, userId } = req.body.payload.payment.entity.notes;

//         try {
//             const enrolledCourse = await Course.findByIdAndUpdate({ _id: courseId },
//                 { $push: { studentsEnrolled: userId } },
//                 { new: true });

//             // wrong upper ?

//             if (!enrolledCourse) {
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Course not found'
//                 });
//             }

//             // add course id to user course list
//             const enrolledStudent = await User.findByIdAndUpdate(userId,
//                 { $push: { courses: courseId } },
//                 { new: true });

//             // send enrolled mail

//             // return response
//             res.status(200).json({
//                 success: true,
//                 message: 'Signature Verified and Course Added'
//             })
//         }

//         catch (error) {
//             console.log('Error while verifing rajorpay signature');
//             console.log(error);
//             return res.status(500).json({
//                 success: false,
//                 error: error.messsage,
//                 message: 'Error while verifing rajorpay signature'
//             });
//         }
//     }

//     else {
//         return res.status(400).json({
//             success: false,
//             message: 'Invalid signature'
//         });
//     }
// }