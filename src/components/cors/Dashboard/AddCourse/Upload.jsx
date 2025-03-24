import React, { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Player } from 'video-react'
import { FiUploadCloud, FiX, FiFile } from "react-icons/fi"
import "video-react/dist/video-react.css"

const Upload = ({ 
  name, 
  label, 
  register, 
  setValue, 
  errors, 
  video = false, 
  viewData = null, 
  editData = null 
}) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(viewData ? viewData : editData ? editData : "")
  const inputRef = useRef(null)
  
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      previewFile(file)
      setSelectedFile(file)
    }
  }
  
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
    noClick: false,
    noKeyboard: false
  })

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleManualBrowse = (e) => {
    e.stopPropagation()
    open()
  }

  useEffect(() => {
    register(name, { required: true })
  }, [register])

  useEffect(() => {
    setValue(name, selectedFile)
  }, [selectedFile, setValue])

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-[#4B5563]" htmlFor={name}>
        {label} {!viewData && <span className="text-[#EF4444]">*</span>}
      </label>

      <div
        className={`${
          isDragActive ? "bg-[#F3F4F6] border-[#422FAF]" : "bg-white border-[#D1D5DB]"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors`}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover shadow-sm"
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}

            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("")
                  setSelectedFile(null)
                  setValue(name, null)
                }}
                className="mt-3 flex items-center justify-center gap-1 text-[#6B7280] hover:text-[#EF4444] transition-colors text-sm font-medium"
              >
                <FiX className="text-base" />
                Remove {!video ? "image" : "video"}
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex w-full flex-col items-center p-6"
            {...getRootProps()}
          >
            <input {...getInputProps()} ref={inputRef} />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-[#EEF2FF]">
              <FiUploadCloud className="text-2xl text-[#422FAF]" />
            </div>
            <p className="mt-2 max-w-[240px] text-center text-sm text-[#6B7280]">
              Drag and drop an {!video ? "image" : "video"}, or click here
            </p>
            
            {/* Explicit Browse Button */}
            <button
              type="button"
              onClick={handleManualBrowse}
              className="mt-3 flex items-center justify-center gap-1 px-3 py-2 bg-[#EEF2FF] text-[#422FAF] rounded-lg hover:bg-[#E0E7FF] transition-colors text-sm font-medium"
            >
              <FiFile className="text-base" />
              Browse Files
            </button>
            
            <ul className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-2 text-center text-xs text-[#6B7280]">
              <li className="flex items-center">
                <div className="mr-1.5 h-1 w-1 rounded-full bg-[#6B7280]"></div>
                Aspect ratio 16:9
              </li>
              <li className="flex items-center">
                <div className="mr-1.5 h-1 w-1 rounded-full bg-[#6B7280]"></div>
                Recommended size 1024x576
              </li>
            </ul>
          </div>
        )}
      </div>

      {errors[name] && (
        <span className="text-xs text-[#EF4444]">
          {label} is required
        </span>
      )}
    </div>
  )
}

export default Upload