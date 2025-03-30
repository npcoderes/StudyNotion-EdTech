import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCourse, setEditCourse, setStep } from '../../../../slices/courseSlice'
import RenderSteps from './RenderSteps'
import { FiInfo } from 'react-icons/fi'
import { HiOutlineLightBulb, HiOutlineAcademicCap } from 'react-icons/hi'
import { motion } from 'framer-motion'

const AddCourses = () => {
    const dispatch = useDispatch()

    useEffect(() => {
       dispatch(setEditCourse(false)) 
       dispatch(setStep(1))
       dispatch(setCourse(null))
    }, [dispatch])

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className='w-full max-w-maxContent mx-auto py-6'
        >
            <div className='flex flex-col lg:flex-row w-full items-start gap-8 h-full'>
                {/* Main Content */}
                <div className='flex flex-1 flex-col'>
                    <div className="mb-8">
                        <motion.h1 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className='text-3xl font-bold text-[#1E293B] mb-3'
                        >
                            <span className="flex items-center gap-2">
                                <HiOutlineAcademicCap className="text-[#3B82F6]" />
                                Create New Course
                            </span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className='text-[#64748B] max-w-2xl'
                        >
                            Share your knowledge with students by creating a comprehensive course. Follow the steps below to set up your course content, structure, and assessments.
                        </motion.p>
                    </div>
                    
                    <div className='bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-6 mb-8'>
                        <div className='flex-1 overflow-auto h-full'>
                            <RenderSteps />
                        </div>
                    </div>
                </div>
                
                {/* Tips Section - Enhanced Design */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className='sticky top-10 hidden lg:block w-full max-w-[380px] rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm'
                >
                    <div className='flex items-center gap-3 mb-5 pb-3 border-b border-[#E2E8F0]'>
                        <div className='bg-[#EFF6FF] p-2 rounded-full'>
                            <FiInfo className='text-[#3B82F6] text-xl' />
                        </div>
                        <h3 className='text-lg font-semibold text-[#1E293B]'>Course Creation Tips</h3>
                    </div>
                    
                    <ul className='space-y-3 text-[#4B5563]'>
                        {[
                            "Set the Course Price option or make it free.",
                            "Standard size for the course thumbnail is 1024x576.",
                            "Video section controls the course overview video.",
                            "Course Builder is where you create & organize a course.",
                            "Add Topics in the Course Builder section to create lessons, quizzes, and assignments.",
                            "Create an exam to test student knowledge before certification.",
                            "Setting a passing score ensures students master your material.",
                            "Information from the Additional Data section shows up on the course single page.",
                            "Make Announcements to notify any important updates to all enrolled students at once.",
                            "Preview your course before publishing to ensure everything looks good."
                        ].map((tip, index) => (
                            <li key={index} className='flex items-start gap-2'>
                                <div className="min-w-[18px] h-[18px] rounded-full bg-[#DBEAFE] flex items-center justify-center mt-1">
                                    <div className="w-[6px] h-[6px] rounded-full bg-[#3B82F6]"></div>
                                </div>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className='mt-6 p-4 bg-[#EFF6FF] rounded-lg border border-[#DBEAFE] flex items-start gap-3'
                    >
                        <HiOutlineLightBulb className="text-[#3B82F6] text-xl mt-0.5 flex-shrink-0" />
                        <p className='text-sm text-[#4B5563]'>
                            <span className='font-semibold text-[#1E293B] block mb-1'>Pro tip:</span> 
                            Take time to plan your course structure and exam questions before starting to create content. This will help you deliver a more cohesive learning experience.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default AddCourses