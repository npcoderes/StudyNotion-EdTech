const subSection= require('../models/SubSection')
const Section=require('../models/Section')
const{uploadImageToCloudinary}=require('../utils/imageUploder')

exports.createSubSection = async (req,res) =>{
    try{
        // Fetch the data
        const{title,timeDuration,description,sectionId}=req.body
        const video=req.file.video
        //validate the data
        if(!title ||!timeDuration ||!description){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        // upload the video
        const uploadVideo= await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
        // create a sub section
        const newSubSection=new subSection({
            title,
            timeDuration,
            description,
            videoUrl:uploadVideo.secure_url,
         
        })
        const savedSubSection=await newSubSection.save()
        // find the section and add the subsection to it
        const section=await Section.findByIdAndUpdate(sectionId,{ // use populate in test
            $push:{
                subsections:savedSubSection._id,
            }
        },
        {new:true})
        if(!section){
            return res.status(404).json({
                success: false,
                message: "Section not found",
            })
        }




        // return the subsection
        res.json({
            success: true,
            data: section,
            message: "Subsection created successfully",
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}


exports.updateSection = async (req, res) => {
    try {
        const { title, timeDuration, description, sectionId } = req.body;
        const newVideo = req.file; // Assuming the new video is attached to the request

        // Validate the data
        if (!title || !timeDuration || !description || !newVideo) {
            return res.status(400).json({
                success: false,
                message: "All fields are required, including a new video",
            });
        }

        // Find the section to get the old video URL
        const section = await subSection.findById(sectionId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        // Delete the old video from cloud storage
        if (section.videoUrl) {
            await deleteFile(section.videoUrl); // Adjust this to match your cloud storage API
        }

        // Upload the new video to cloud storage and get the secure URL
        const uploadedVideo = await uploadImageToCloudinary(newVideo,process.env.FOLDER_NAME) // Adjust this to match your cloud storage API
        const videoUrl = uploadedVideo.secure_url; // This depends on your cloud storage provider

        // Update the section with the new video URL and other fields
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { title, timeDuration, description, videoUrl },
            { new: true }
        );

        res.json({
            success: true,
            data: updatedSection,
            message: "Section updated successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.body

        // Delete the section
        const deletedSection = await Section.findByIdAndDelete(sectionId);

        if (!deletedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        res.json({
            success: true,
            data: deletedSection,
            message: "Section deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};