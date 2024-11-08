import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { useSelector } from 'react-redux'

const TagInput = ({ label, name, placeholder, register, errors, setValue, }) => {
  const{editCourse,course}=useSelector(state=>state.course)
  const[chips,setChips]=useState([])

  useEffect(()=>{
    if(editCourse){
      
      setChips(course?.tag)
    }
    register(name, { required: true, validate: (value) => value.length > 0 }, chips);
  },[])

  useEffect(()=>{
    setValue(name, chips)
  },[chips])

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

  const handleDeleteChip = (chip) => {
    const newChips = chips.filter((_,c) => c!== chip)  // check underscore
    setChips(newChips)
  }

  return (
    <>
    <div className='flex flex-col space-y-2'>
      <label htmlFor={name} className='label-form text-white'>
      {label} <sup className="text-pink-200">*</sup>
      </label>
      <div className='flex flex-wrap w-full gap-y-2'>
        {chips.map((chip,index)=>(
          <div key={index} className='m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5'>
            {chip}

            <button type='button' onClick={()=>handleDeleteChip(index)} className='ml-2 focus:outline-none'> <MdClose className='text-sm'/></button>
          </div>
        ))}
      </div>

      <input type="text"
           className='form-style w-full'
           id={name}
           name={name}
           placeholder={placeholder}
           onKeyDown={handleKeyDown}
      />
      {
        errors[name] && (
          <span className="text-sm text-red-500">
            {errors[name].message}
          </span>
        )
      }
    </div>
    </>
  )
}

export default TagInput