import React, { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useSelector } from 'react-redux'

const TagInput = ({ 
  label, 
  name, 
  placeholder, 
  register, 
  errors, 
  setValue 
}) => {
  const { editCourse, course } = useSelector(state => state.course)
  const [chips, setChips] = useState([])

  useEffect(() => {
    if (editCourse) {
      setChips(course?.tag)
    }
    register(
      name, 
      { required: true, validate: (value) => value.length > 0 }, 
      chips
    );
  }, [])

  useEffect(() => {
    setValue(name, chips)
  }, [chips])

  const handleKeyDown = (event) => {
    // Check if user presses "Enter" or ","
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      // Get the input value and remove any leading/trailing spaces
      const chipValue = event.target.value.trim()
      // Check if the input value exists and is not already in the chips array
      if (chipValue && !chips.includes(chipValue)) {
        // Add the chip to the array and clear the input
        const newChips = [...chips, chipValue]
        setChips(newChips)
        event.target.value = ""
      }
    }
  }

  const handleDeleteChip = (index) => {
    const newChips = chips.filter((_, i) => i !== index)
    setChips(newChips)
  }

  return (
    <div className='flex flex-col space-y-2'>
      <label htmlFor={name} className='text-sm font-medium text-[#4B5563]'>
        {label} <span className="text-[#EF4444]">*</span>
      </label>
      
      {/* Tags Container */}
      <div className='flex flex-wrap gap-2 min-h-[40px] p-2 border border-[#D1D5DB] bg-white rounded-lg'>
        {chips.length > 0 ? (
          chips.map((chip, index) => (
            <div 
              key={index} 
              className='flex items-center gap-1 px-2 py-1 bg-[#EEF2FF] text-[#422FAF] border border-[#E0E7FF] rounded-md text-sm'
            >
              {chip}
              <button 
                type='button' 
                onClick={() => handleDeleteChip(index)} 
                className='p-0.5 hover:bg-[#E0E7FF] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#422FAF]'
                aria-label={`Remove tag: ${chip}`}
              > 
                <FiX className='text-xs' />
              </button>
            </div>
          ))
        ) : (
          <div className='text-xs text-[#9CA3AF] py-1'>
            No tags added yet
          </div>
        )}
      </div>

      {/* Input Field */}
      <input 
        type="text"
        id={name}
        name={name}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2.5 text-[#111827] bg-white border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#422FAF] focus:border-[#422FAF] focus:outline-none transition-colors"
      />
      
      <p className="text-xs text-[#6B7280]">
        Press Enter or Comma to add a new tag
      </p>

      {/* Error Message */}
      {errors[name] && (
        <span className="text-xs text-[#EF4444]">
          Please add at least one tag
        </span>
      )}
    </div>
  )
}

export default TagInput