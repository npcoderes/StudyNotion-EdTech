import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";

const RequirementInstruction = ({
  name,
  label,
  register,
  setValue,
  errors,
}) => {
  const { editCourse, course } = useSelector((state) => state.course);
  const [requirement, setRequirement] = useState("");
  const [requirementsList, setRequirementsList] = useState([]);

  useEffect(() => {
    if (editCourse) {
      setRequirementsList(course?.instructions);
    }
    register(
      name,
      { required: true, validate: (value) => value.length > 0 },
      requirementsList
    );
  }, []);

  useEffect(() => {
    setValue(name, requirementsList);
  }, [requirementsList]);

  const handleAdd = (event) => {
    event.preventDefault();
    // Get the input value and remove any leading/trailing spaces
    const chipValue = requirement.trim();
    // Check if the input value exists and is not already in the chips array
    if (chipValue && !requirementsList.includes(chipValue)) {
      // Add the chip to the array and clear the input
      const newChips = [...requirementsList, chipValue];
      setRequirement("");
      setRequirementsList(newChips);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd(e);
    }
  };

  const handleDeleteChip = (index) => {
    const newChips = requirementsList.filter((_, i) => i !== index);
    setRequirementsList(newChips);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-[#4B5563]">
        {label} <span className="text-[#EF4444]">*</span>
      </label>

      <div className="flex flex-col items-start space-y-2">
        <div className="flex w-full gap-2">
          <input
            type="text"
            id={name}
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a requirement or instruction"
            className="flex-1 px-4 py-2.5 text-[#111827] bg-white border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#422FAF] focus:border-[#422FAF] focus:outline-none transition-colors"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1 px-3 py-2 bg-[#422FAF] text-white rounded-lg hover:bg-[#3B27A1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#422FAF] focus:ring-offset-2"
          >
            <FiPlus />
            <span className="font-medium">Add</span>
          </button>
        </div>
        <p className="text-xs text-[#6B7280]">
          Press Enter or click Add to add a new requirement
        </p>
      </div>

      {requirementsList.length > 0 && (
        <div className="mt-4 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
          <h4 className="text-sm font-medium text-[#111827] mb-2">Requirements/Instructions:</h4>
          <ul className="space-y-2">
            {requirementsList.map((requirement, index) => (
              <li 
                key={index} 
                className="flex items-start gap-2 text-[#4B5563]"
              >
                <div className="min-w-4 mt-1">•</div>
                <div className="flex-1">{requirement}</div>
                <button
                  type="button"
                  className="p-1 hover:bg-[#FEE2E2] text-[#9CA3AF] hover:text-[#EF4444] rounded transition-colors"
                  onClick={() => handleDeleteChip(index)}
                  aria-label={`Remove requirement: ${requirement}`}
                >
                  <RiDeleteBin6Line className="text-sm" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {errors[name] && (
        <span className="text-xs text-[#EF4444]">
          {label} is required
        </span>
      )}
    </div>
  );
};

export default RequirementInstruction;