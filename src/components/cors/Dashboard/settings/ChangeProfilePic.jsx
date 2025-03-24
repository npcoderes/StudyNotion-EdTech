import { useEffect, useRef, useState } from "react"
import { FiUpload, FiImage, FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

export default function ChangeProfilePic() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)
  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        alert("File size should be less than 1MB")
        return
      }
      setImageFile(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleFileUpload = async () => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("displayPicture", imageFile)
      await dispatch(updateDisplayPicture(token, formData))
      setImageFile(null)
    } catch (error) {
      console.error("Upload failed:", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setImageFile(null)
    setPreviewSource(null)
  }

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile)
    }
  }, [imageFile])
  
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-8 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111827] mb-6 flex items-center">
        <span className="inline-block w-1 h-6 bg-[#422faf] rounded mr-3"></span>
        Profile Image
      </h2>
      
      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Profile Image Preview */}
        <div className="relative group">
          <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-[#E5E7EB] shadow-sm">
            <img
              src={previewSource || user?.image}
              alt={`profile-${user?.firstName}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          
          <button 
            onClick={handleClick}
            className="absolute inset-0 bg-[#111827] bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            type="button"
            disabled={loading}
          >
            <FiImage className="text-white text-2xl" />
          </button>
        </div>

        {/* Upload Controls */}
        <div className="flex flex-col items-center sm:items-start space-y-4 mt-4 sm:mt-0">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-[#111827] mb-1">
              Change Profile Picture
            </h3>
            <p className="text-[#6B7280] text-sm">
              Upload a new profile picture. Recommended size: 300x300px
            </p>
            <p className="text-[#6B7280] text-xs mt-1">
              Supported formats: JPG, PNG, GIF (Max 1MB)
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/gif, image/jpeg"
            />
            
            {!imageFile ? (
              <button
                onClick={handleClick}
                disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-[#F9FAFB] border border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6] hover:border-[#9CA3AF] transition-colors font-medium flex items-center gap-2"
                type="button"
              >
                <FiImage className="text-lg" />
                Select Image
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-white border border-[#D1D5DB] text-[#4B5563] hover:bg-[#F3F4F6] transition-colors font-medium flex items-center gap-1.5"
                  type="button"
                >
                  <FiTrash2 className="text-[#DC2626]" />
                  Cancel
                </button>
                
                <IconBtn
                  text={loading ? "Uploading..." : "Upload"}
                  onclick={handleFileUpload}
                  disabled={loading}
                  className="bg-[#422faf] hover:bg-[#3B27A1] text-white disabled:opacity-50 px-5 py-2.5"
                >
                  {!loading && <FiUpload />}
                </IconBtn>
              </div>
            )}
          </div>
          
          {imageFile && (
            <div className="text-[#059669] text-sm flex items-center gap-1.5 mt-2">
              <div className="w-1.5 h-1.5 bg-[#059669] rounded-full"></div>
              <span>{imageFile.name} selected</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Image Upload Tips */}
      <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
        <h4 className="font-medium text-[#111827] mb-2">Tips for a good profile picture:</h4>
        <ul className="text-sm text-[#6B7280] space-y-1.5 list-disc pl-5">
          <li>Choose a recent photo where your face is clearly visible</li>
          <li>Make sure the lighting is good and the image is not blurry</li>
          <li>Use a neutral background that doesn't distract from your face</li>
          <li>Show only yourself, not a group photo</li>
        </ul>
      </div>
    </div>
  )
}