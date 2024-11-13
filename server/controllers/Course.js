const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/Subsection");
const { uploadImageToCloudinary,deleteResourceFromCloudinary } = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration")
// Function to create a new course
exports.createCourse = async (req, res) => {
	try {
		// Get user ID from request object
		const userId = req.user.id;

		// Get all required fields from request body
		let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			category,
			status,
			instructions,
		} = req.body;

		// Get thumbnail image from request files
		const thumbnail = req.files.thumbnailImage;

		// Check if any of the required fields are missing
		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag ||
			!thumbnail ||
			!category
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}
		if (!status || status === undefined) {
			status = "Draft";
		}
		// Check if the user is an instructor
		const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});

		if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			});
		}

		// Check if the tag given is valid
		const categoryDetails = await Category.findById(category);
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}
		// Upload the Thumbnail to Cloudinary
		const thumbnailImage = await uploadImageToCloudinary(
			thumbnail,
			process.env.FOLDER_NAME
		);
		// console.log(thumbnailImage); // Commented out for security
		// Create a new course with the given details
		const newCourse = await Course.create({
			courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag: tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
		});

		// Add the new course to the User Schema of the Instructor
		await User.findByIdAndUpdate(
			{
				_id: instructorDetails._id,
			},
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);
		// Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);
		// Return the new course and a success message
		res.status(200).json({
			success: true,
			data: newCourse,
			message: "Course Created Successfully",
		});
	} catch (error) {
		// Handle any errors that occur during the creation of the course
		// console.error(error); // Commented out for security
		res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
		});
	}
};

exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find()
			.populate("instructor")
			.exec();
		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		// console.log(error); // Commented out for security
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};

//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
            //get id
            const {courseId} = req.body;
            //find course details
            const courseDetails = await Course.find(
                                        {_id:courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails",
                                                },
                                            }
                                        )
                                        .populate("category")
                                        //.populate("ratingAndreviews")
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                            },
                                        })
                                        .exec();

                //validation
                if(!courseDetails) {
                    return res.status(400).json({
                        success:false,
                        message:`Could not find the course with ${courseId}`,
                    });
                }
                //return response
                return res.status(200).json({
                    success:true,
                    message:"Course Details fetched successfully",
                    data:courseDetails,
                })

    }
    catch(error) {
        // console.log(error); // Commented out for security
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

// ================ Edit Course Details ================
exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const updates = req.body
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }

        // If Thumbnail Image is found, update it
        if (req.files) {
            // console.log("thumbnail update")
            const thumbnail = req.files.thumbnailImage
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url
        }

        // Update only the fields that are present in the request body
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (key === "tag" || key === "instructions") {
                    course[key] = JSON.parse(updates[key])
                } else {
                    course[key] = updates[key]
                }
            }
        }

        // updatedAt
        course.updatedAt = Date.now();

        //   save data
        await course.save()

        const updatedCourse = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        // success response
        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })
    } catch (error) {
        // console.error(error) // Commented out for security
        res.status(500).json({
            success: false,
            message: "Error while updating course",
            error: error.message,
        })
    }
}



// ================ Get a list of Course for a given Instructor ================
exports.getInstructorCourses = async (req, res) => {
    try {
        // Get the instructor ID from the authenticated user or request body
        const instructorId = req.user.id

        // Find all courses belonging to the instructor
        const instructorCourses = await Course.find({ instructor: instructorId, }).sort({ createdAt: -1 })


        // Return the instructor's courses
        res.status(200).json({
            success: true,
            data: instructorCourses,
            // totalDurationInSeconds:totalDurationInSeconds,
            message: 'Courses made by Instructor fetched successfully'
        })
    } catch (error) {
        // console.error(error) // Commented out for security
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        })
    }
}



// ================ Delete the Course ================
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        // Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled;
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            });
        }

        // Delete course thumbnail From Cloudinary
        await deleteResourceFromCloudinary(course?.thumbnail);

        // Delete sections and sub-sections
        const courseSections = course.courseContent;
        for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await Section.findById(sectionId);
            if (section) {
                const subSections = section.subSection;
                for (const subSectionId of subSections) {
                    const subSection = await SubSection.findById(subSectionId);
                    if (subSection) {
                        await deleteResourceFromCloudinary(subSection.videoUrl); // delete course videos From Cloudinary
                    }
                    await SubSection.findByIdAndDelete(subSectionId);
                }
            }

            // Delete the section
            await Section.findByIdAndDelete(sectionId);
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId);

        // Remove the course ID from the associated category
        await Category.findOneAndUpdate(
            { courses: courseId },
            { $pull: { courses: courseId } }
        );

        return res.status(200).json({
            success: true, 
            message: "Course deleted successfully",
        });

    } catch (error) {
        // console.error(error); // Commented out for security
        return res.status(500).json({
            success: false,
            message: "Error while Deleting course",
            error: error.message,
        });
    }
}


// ================ Get Full Course Details ================
exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.user.id
        // console.log('courseId userId  = ', courseId, " == ", userId)

        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        })

        //   console.log("courseProgressCount : ", courseProgressCount)

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }

        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        //   count total time duration of course
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : [],
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


