// Import necessary modules
const Section = require("../models/Section");
const SubSection = require("../models/Subsection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create a new sub-section for a given section
exports.createSubSection = async (req, res) => {
    try {
      // Extract necessary information from the request body
      const { sectionId, title, description } = req.body
      const video = req.files?.video
      const pdfMaterial = req.files?.pdfMaterial
  
      // Check if all necessary fields are provided
      if (!sectionId || !title || !description || (!video && !pdfMaterial)) {
        return res
          .status(404)
          .json({ success: false, message: "Required fields are missing. Include title, description, and either video or PDF material." })
      }
  
      // Initialize subsection data
      const subsectionData = {
        title,
        description,
      }
      
      // Handle video upload if present
      if (video) {
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subsectionData.videoUrl = uploadDetails.secure_url
        subsectionData.timeDuration = `${uploadDetails.duration}`
      } else {
        subsectionData.videoUrl = null
        subsectionData.timeDuration = "0"
      }
      
      // Handle PDF upload if present
      if (pdfMaterial) {
        const pdfUploadDetails = await uploadImageToCloudinary(
          pdfMaterial,
          process.env.FOLDER_NAME
        )
        subsectionData.otherUrl = pdfUploadDetails.secure_url
      }
  
      // Create a new sub-section with the necessary information
      const SubSectionDetails = await SubSection.create(subsectionData)
  
      // Update the corresponding section with the newly created sub-section
      const updatedSection = await Section.findByIdAndUpdate(
        { _id: sectionId },
        { $push: { subSection: SubSectionDetails._id } },
        { new: true }
      ).populate("subSection")
  
      // Return the updated section in the response
      return res.status(200).json({ 
        success: true, 
        data: updatedSection,
        message: "Subsection created successfully" 
      })
    } catch (error) {
      // Handle any errors that may occur during the process
      console.error("Error creating new sub-section:", error)
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
}
  
exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId, title, description, subSectionId } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      
      // Handle video file update
      if (req.files && req.files.videoFile) {
        const video = req.files.videoFile
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
      
      // Handle PDF material update
      if (req.files && req.files.pdfMaterial) {
        const pdfMaterial = req.files.pdfMaterial
        const pdfUploadDetails = await uploadImageToCloudinary(
          pdfMaterial,
          process.env.FOLDER_NAME
        )
        subSection.otherUrl = pdfUploadDetails.secure_url
      }
      
      // Handle PDF removal if explicitly requested
      if (req.body.removePdf === "true") {
        subSection.otherUrl = null
      }
  
      await subSection.save()
      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
      return res.json({
        success: true,
        data: updatedSection,
        message: "Subsection updated successfully",
      })
    } catch (error) {
      console.error("Error updating subsection:", error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the subsection",
        error: error.message,
      })
    }
}
  
exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      const updatedSection = await Section.findById(sectionId).populate('subSection')
  
      return res.json({
        success: true,
        data: updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting subsection:", error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
        error: error.message,
      })
    }
}

// New endpoint to get subsection details
exports.getSubSectionDetails = async (req, res) => {
    try {
      const { subSectionId } = req.params
      
      const subSection = await SubSection.findById(subSectionId)
      
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
      
      return res.status(200).json({
        success: true,
        data: subSection,
      })
    } catch (error) {
      console.error("Error fetching subsection details:", error)
      return res.status(500).json({
        success: false,
        message: "Something went wrong while fetching subsection details",
        error: error.message,
      })
    }
}