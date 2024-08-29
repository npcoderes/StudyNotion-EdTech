const Section = require("../models/Section");
const Course = require("../models/Course");
// CREATE a new section
exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body;

		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		// Add the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// UPDATE a section
exports.updateSection = async (req, res) => {
	try {
        // extract data
        const { sectionName, sectionId, courseId } = req.body;

        // validation
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // update section name in DB
        await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

        const updatedCourseDetails = await Course.findById(courseId)
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            })

        res.status(200).json({
            success: true,
            data:updatedCourseDetails,
            message: 'Section updated successfully'
        });
    }
    catch (error) {
        console.log('Error while updating section');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while updating section'
        })
    }
};

// DELETE a section
exports.deleteSection = async (req, res) => {
	try {
		//HW -> req.params -> test
		const { sectionId ,courseId} = req.body;
		await Section.findByIdAndDelete(sectionId);
		//HW -> Course ko bhi update karo
        const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$pull: {
					courseContent: sectionId
				},
			},
			{ new: true }
		)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();
		res.status(200).json({
			success: true,
			message: "Section deleted",
			data: updatedCourse
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   