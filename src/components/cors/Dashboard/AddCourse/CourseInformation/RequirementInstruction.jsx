import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
const RequirementInstruction = ({
  name,
  label,
  register,
  setValue,
  errors,
}) => {
  const { editCourse, course } = useSelector((state) => state.course);
  const [requirement, setRequirement] = useState("")
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
  const handleadd = (event) => {
    event.preventDefault();
    // Get the input value and remove any leading/trailing spaces
    const chipValue = requirement
    // Check if the input value exists and is not already in the chips array
    if (chipValue && !requirementsList.includes(chipValue)) {
      // Add the chip to the array and clear the input
      const newChips = [...requirementsList, chipValue];
      setRequirement("")
      setRequirementsList(newChips);
      
    }
  };
  const handleDeleteChip = (chip) => {
    const newChips = requirementsList.filter((_, c) => c !== chip); // check underscore
    setRequirementsList(newChips);
  };

  return (
    <>
      <div className="flex flex-col space-y-2">
        <label htmlFor={name} className="label-style">
          {label} <sup className="text-pink-200">*</sup>
        </label>

        <div className="flex flex-col items-start space-y-2">
          <input
            type="text"
            id={name}
            value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
            className="form-style w-full"
          />{" "}
          <button
            type="button"
            onClick={handleadd}
            className="font-semibold text-yellow-50"
          >
            Add
          </button>
        </div>

        {requirementsList.length > 0 && (
        <ul className="mt-2 list-inside list-disc">
          {requirementsList.map((requirement, index) => (
            <li key={index} className="flex items-center text-richblack-5">
              <span>{requirement}</span>
              <button
                type="button"
                className="ml-2 text-xs text-pure-greys-300 "
                onClick={() => handleDeleteChip(index)}
              >
                {/* clear  */}
                <RiDeleteBin6Line className="text-pink-200 text-sm hover:scale-125 duration-200" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}

      </div>
    </>
  );
};

export default RequirementInstruction;
