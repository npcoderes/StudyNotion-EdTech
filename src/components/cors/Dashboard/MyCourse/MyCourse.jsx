import React from 'react';
import { Link } from 'react-router-dom';
import { IoAddOutline } from "react-icons/io5";
import RenderInstructorCourses from './RenderInstructorCourses';
import { motion } from 'framer-motion';

const MyCourse = () => {
  return (
    <motion.div 
      className='w-full max-w-maxContent mx-auto'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-semibold text-[#111827] mb-1'>
            My Courses
          </h1>
          <p className='text-[#6B7280]'>
            Manage and track your created courses
          </p>
        </div>
        
        <Link to='/dashboard/add-course'>
          <motion.button
            className='flex items-center gap-2 px-4 py-2.5 bg-[#422FAF] text-white rounded-lg hover:bg-[#3B27A1] transition-colors shadow-sm'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IoAddOutline className='text-xl' />
            <span className='font-medium'>Create New Course</span>
          </motion.button>
        </Link>
      </div>

      {/* Search and Filter - Optional Enhancement */}
      <div className='mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB]'>
        <div className='text-sm text-[#4B5563]'>
          <span>Easily manage all your created courses</span>
        </div>
       
      </div>

      {/* Courses List */}
      <div className='bg-white rounded-xl border border-[#E5E7EB] shadow-sm'>
        <RenderInstructorCourses />
      </div>
    </motion.div>
  );
};

export default MyCourse;