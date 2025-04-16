import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const TagInput = ({ 
  label, 
  name, 
  placeholder, 
  register, 
  errors, 
  setValue 
}) => {
  const { editCourse, course } = useSelector(state => state.course);
  const [chips, setChips] = useState([]);
  const [hasRequiredTag, setHasRequiredTag] = useState(false);
  
  // Required skill level tags
  const REQUIRED_TAGS = ["Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    if (editCourse) {
      setChips(course?.tag || []);
      // Check if course already has one of the required tags
      const hasRequired = course?.tag?.some(tag => 
        REQUIRED_TAGS.includes(tag)
      );
      setHasRequiredTag(hasRequired);
    }
    
    register(
      name, 
      { 
        required: true, 
        validate: (value) => {
          // Validation: Must have at least one tag AND one must be a required tag
          return value.length > 0 && value.some(tag => REQUIRED_TAGS.includes(tag));
        }
      }
    );
  }, []);

  useEffect(() => {
    setValue(name, chips);
    // Update whether we have a required tag
    const hasRequired = chips.some(tag => REQUIRED_TAGS.includes(tag));
    setHasRequiredTag(hasRequired);
  }, [chips]);

  const handleKeyDown = (event) => {
    // Check if user presses "Enter" or ","
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      // Get the input value and remove any leading/trailing spaces
      const chipValue = event.target.value.trim();
      // Check if the input value exists and is not already in the chips array
      if (chipValue && !chips.includes(chipValue)) {
        // Add the chip to the array and clear the input
        const newChips = [...chips, chipValue];
        setChips(newChips);
        event.target.value = "";
      }
    }
  };

  const handleDeleteChip = (index) => {
    const newChips = chips.filter((_, i) => i !== index);
    setChips(newChips);
  };
  
  const handleAddRequiredTag = (tag) => {
    // Don't add if already in the list
    if (!chips.includes(tag)) {
      // Remove any other required tags first (we only want one skill level)
      const filteredChips = chips.filter(chip => !REQUIRED_TAGS.includes(chip));
      setChips([...filteredChips, tag]);
    }
  };

  // Check if a tag is a required tag
  const isRequiredTag = (tag) => REQUIRED_TAGS.includes(tag);

  return (
    <div className='flex flex-col space-y-3'>
      <label htmlFor={name} className='text-sm font-medium text-[#4B5563]'>
        {label} <span className="text-[#EF4444]">*</span>
      </label>
      
      {/* Skill Level Selection */}
      <div className="flex flex-wrap gap-2">
        <p className="w-full text-xs text-[#6B7280]">Select course difficulty level (required):</p>
        {REQUIRED_TAGS.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => handleAddRequiredTag(tag)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              chips.includes(tag) 
                ? "bg-[#422FAF] text-white" 
                : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      
      {/* Tags Container */}
      <div className='flex flex-wrap gap-2 min-h-[40px] p-3 border border-[#D1D5DB] bg-white rounded-lg'>
        {chips.length > 0 ? (
          chips.map((chip, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-1.5 px-3 py-1.5 ${
                isRequiredTag(chip) 
                  ? "bg-[#422FAF] text-white" 
                  : "bg-[#EEF2FF] text-[#422FAF] border border-[#E0E7FF]"
              } rounded-md text-sm`}
            >
              {chip}
              <button 
                type='button' 
                onClick={() => handleDeleteChip(index)}
                className={`p-0.5 ${
                  isRequiredTag(chip) 
                    ? "hover:bg-[#3B27A1]" 
                    : "hover:bg-[#E0E7FF]"
                } rounded-full transition-colors focus:outline-none`}
                aria-label={`Remove tag: ${chip}`}
                disabled={isRequiredTag(chip) && hasRequiredTag && chips.length === 1}
              > 
                <FiX className={`text-xs ${isRequiredTag(chip) ? "text-white" : ""}`} />
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
        placeholder={hasRequiredTag ? placeholder : "First select a difficulty level above"}
        onKeyDown={handleKeyDown}
        className={`w-full px-4 py-2.5 text-[#111827] bg-white border ${
          hasRequiredTag ? "border-[#D1D5DB]" : "border-[#FCA5A5]"
        } rounded-lg focus:ring-2 focus:ring-[#422FAF] focus:border-[#422FAF] focus:outline-none transition-colors`}
        disabled={!hasRequiredTag}
      />
      
      <div className="flex flex-wrap justify-between items-start">
        <p className="text-xs text-[#6B7280]">
          Press Enter or Comma to add a new tag
        </p>

        {/* Tag Count */}
        <p className="text-xs text-[#6B7280]">
          {chips.length} tag{chips.length !== 1 ? 's' : ''} added
        </p>
      </div>

      {/* Error Messages */}
      {errors[name] && !chips.length && (
        <span className="text-xs text-[#EF4444]">
          Please add at least one tag
        </span>
      )}
      
      {errors[name] && chips.length > 0 && !hasRequiredTag && (
        <span className="text-xs text-[#EF4444]">
          Please select one difficulty level (Beginner, Intermediate, or Advanced)
        </span>
      )}
    </div>
  );
};

export default TagInput;