const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
const {uploadPdfToCloudinary,uploadImageToCloudinary}=require("../utils/imageUploader")
require("dotenv").config();

// Signup Controller for Registering Users

exports.signup = async (req, res) => {
	try {
		// Destructure fields from the request body
		const {
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
			accountType,
			contactNumber,
			otp
		} = req.body;
		 console.log("req.body",req.body)
		//  console.log("req.file",req.file)
        //  let documents = req.file;
		//  if (!documents) {
		// 	return res.status(400).json({ success: false, message: "Documents are required" });
		//   }

		if (!req.files || !req.files.file) {
			return res.status(400).send({ message: "No file uploaded." });
		  }

		console.log("req.files",req.files)

		let documents=req.files.file
		
		// Check if All Details are there or not
		if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			!confirmPassword ||
			!otp 
		
		) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}
		// Check if password and confirm password match
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
		}

		// Find the most recent OTP for the email
		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		// console.log(response); // Commented out for security
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the user
		let approved = accountType;
		approved === "Instructor" ? (approved = false) : (approved = true);
		let active=accountType
		active === "Instructor" ? (active = false) : (active = true);
        let documentUrl
		if(documents){
			 documentUrl = await uploadImageToCloudinary(documents,process.env.FOLDER_NAME);
			console.log("Document Url", documentUrl.secure_url);
		}

		// Create the Additional Profile For User
		const profileDetails = await Profile.create({
			gender: null,
			dateOfBirth: null,
			about: null,
			contactNumber: null,
		});

		const user = await User.create({
			firstName,
			lastName,
			email,
			contactNumber,
			password: hashedPassword,
			accountType: accountType,
			approved: approved,
			additionalDetails: profileDetails._id,
			image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
			documents: documentUrl.secure_url,
		});

		if(accountType === "Instructor"){
			await mailSender(
				user.email,
				"Instructor Account Created",
				`
				<html>
				  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
					<div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
					  <header style="text-align: center; padding-bottom: 20px;">
						<h1 style="color: #4CAF50;">StudyNotion</h1>
					  </header>
					  <main>
						<h2>Hello ${user.firstName} ${user.lastName},</h2>
						<p>We are excited to inform you that your Instructor account has been created successfully. Please wait for approval from our team.</p>
						<p>In the meantime, you can explore our platform and get familiar with the features available to instructors.</p>
						<div style="text-align: center; margin: 20px 0;">
						  <a href="https://studynotion.com/login" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Your Account</a>
						</div>
					  </main>
					  <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
						<p style="font-size: 0.9em; color: #777;">&copy; 2023 StudyNotion. All rights reserved.</p>
					  </footer>
					</div>
				  </body>
				</html>
				`
			  );

          return res.status(201).json({
			success: true,
			user,
			message: "Your Account is Created Successfully, Please Wait for Approval",
		});

		}

		return res.status(200).json({
			success: true,
			user,
			message: "User registered successfully",
		});
	} catch (error) {
		// console.error(error); // Commented out for security
		return res.status(500).json({
			success: false,
			message: error,
		});
	}
};

// Login controller for authenticating users
exports.login = async (req, res) => {
	try {
		// Get email and password from request body
		const { email, password } = req.body;

		// Check if email or password is missing
		if (!email || !password) {
			// Return 400 Bad Request status code with error message
			return res.status(400).json({
				success: false,
				message: `Please Fill up All the Required Fields`,
			});
		}



		// Find user with provided email
		const user = await User.findOne({ email }).populate("additionalDetails").exec();
		console.log("user......", user); // Commented out for security




		// If user not found with provided email
		if (!user) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is not Registered with Us Please SignUp to Continue`,
			});
		}
		if (user.approved === false) {
			return res.status(401).json({
				success: false,
				message: `Your Account is not Approved Yet`,
			});
		}
		if(user.active === false){
			return res.status(401).json({
				success: false,
				message: `Your Account is Deactivated`,
			});
		}

		// Generate JWT token and Compare Password
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{ email: user.email, id: user._id, accountType: user.accountType },
				process.env.JWT_SECRET
			);

			// Save token to user document in database
			user.token = token;
			user.password = undefined;
			// Set cookie for token and return success response
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});
		} else {
			return res.status(401).json({
				success: false,
				message: `Password is incorrect`,
			});
		}
	} catch (error) {
		// console.error(error); // Commented out for security
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
	}
};
// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
	try {
		const { email } = req.body;

		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = await User.findOne({ email });
		// to be used in case of signup

		// If user found with provided email
		if (checkUserPresent) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		// console.log("Result is Generate OTP Func"); // Commented out for security
		// console.log("OTP", otp); // Commented out for security
		// console.log("Result", result); // Commented out for security
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		// console.log("OTP Body", otpBody); // Commented out for security
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		// console.log(error.message); // Commented out for security
		return res.status(500).json({ success: false, error: error.message });
	}
};

// Controller for Changing Password
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		// if (newPassword !== confirmNewPassword) {
		// 	// If new password and confirm new password do not match, return a 400 (Bad Request) error
		// 	return res.status(400).json({
		// 		success: false,
		// 		message: "The password and confirm password does not match",
		// 	});
		// }

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			// console.log("Email sent successfully:", emailResponse.response); // Commented out for security
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			// console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		// console.error("Error occurred while updating password:", error); // Commented out for security
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};

exports.signgoogle = async (req, res) => {
	try {
		const email = req.body.email;
		const user = await User.findOne({ email: email }).populate("additionalDetails");
		if (user) {
			const token = jwt.sign(
				{ email: user.email, id: user._id, accountType: user.accountType },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				});
			// Save token to user document in database
			user.token = token;
			user.password = undefined;
			// Set cookie for token and return success response
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});
		}

	} catch (err) {
		// console.error("Error occurred while updating password:", err); // Commented out for security
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: err.message,
		});
	}
}


// get not approve user
exports.getNotApprovedUser = async (req, res) => {
	try {
		const users = await User.find({ approved: false }).populate("additionalDetails");
		res.status(200).json(users);
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: "Error occurred while getting users",
			error: err.message,
		});
	}
}

