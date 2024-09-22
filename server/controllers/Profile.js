const Profile = require("../models/Profile");
const User = require("../models/User");

const { uploadImageToCloudinary } = require("../utils/imageUploader");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Method for updating a profile
exports.updateProfile = async (req, res) => {
	try {
		const { firstName,lastName,gender,dateOfBirth = "", about = "", contactNumber } = req.body;
		const id = req.user.id;

		// Find the profile by id
		const userDetails = await User.findById(id);
		const profile = await Profile.findById(userDetails.additionalDetails);
        userDetails.firstName=firstName;
		userDetails.lastName=lastName;
		await userDetails.save();
		// Update the profile fields
		profile.dateOfBirth = dateOfBirth;
		profile.about = about;
		profile.contactNumber = contactNumber;
		profile.gender = gender;

		// Save the updated profile
		await profile.save();

		return res.json({
			success: true,
			message: "Profile updated successfully",
			profile,
			userDetails
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

exports.deleteAccount = async (req, res) => {
	try {
		// TODO: Find More on Job Schedule
		// const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job);
		console.log("Printing ID: ", req.user.id);
		const id = req.user.id;
		
		const user = await User.findById({ _id: id });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		// Delete Assosiated Profile with the User
		await Profile.findByIdAndDelete({ _id: user.additionalDetails });
		// TODO: Unenroll User From All the Enrolled Courses
		// Now Delete User
		await User.findByIdAndDelete({ _id: id });
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ success: false, message: "User Cannot be deleted successfully" });
	}
};

exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();
		console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
// Helper function to convert seconds to HH:MM:SS format
const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
};

exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id;

      const userDetails = await User.findById(userId)
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec();

      if (!userDetails) {
        return res.status(404).json({
          success: false,
          message: `Could not find user with id: ${userId}`,
        });
      }

      const enrolledCourses = userDetails.courses.map(course => {
        let totalDurationInSeconds = 0;
        course.courseContent.forEach(content => {
          content.subSection.forEach(subSection => {
            let duration = parseFloat(subSection.timeDuration) || 0;
            if (duration < 60) {
              // Assume it's in minutes
              duration *= 60;
            } else if (duration >= 3600) {
              // Assume it's in hours
              duration *= 3600;
            }
            // If between 60 and 3600, assume it's already in seconds
            totalDurationInSeconds += duration;
          });
        });

        return {
          ...course.toObject(),
          totalDuration: formatDuration(totalDurationInSeconds),
          totalDurationInSeconds: Math.round(totalDurationInSeconds)
        };
      });

      return res.status(200).json({
        success: true,
        data: enrolledCourses,
      });
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching enrolled courses",
        error: error.message,
      });
    }
};

