import React from 'react'
import IconBtn from '../../../common/IconBtn'
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdAddCircle } from 'react-icons/md';
import { Link } from 'react-router-dom';
import RenderInstructorCourses from './RenderInstructorCourses';


const MyCourse = () => {
  return (
    <div>
        <div className='flex justify-between'>
        <h1 className='text-3xl font-medium tracking-wide'>
            My Courses
        </h1>
        <Link to='/dashboard/add-course'>
        <IconBtn text={"New"} customClasses={" flex-row-reverse gap-2  text-lg   border-b-[2px] border-r-[2px] border-yellow-5 "} spanclass={"text-lg"} >
            <IoIosAddCircleOutline  className='font-extrabold text-black text-xl   '/>
            
             {/* <MdAddCircle className='text-lg  ' /> */}
        </IconBtn>
        </Link>


        </div>
        <>
        <RenderInstructorCourses />
        </>
    </div>
  )
}

export default MyCourse