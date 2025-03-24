import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCourse, setEditCourse, setStep } from '../../../../slices/courseSlice'
import RenderSteps from './RenderSteps'
import { FiInfo } from 'react-icons/fi'
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
            className='w-full max-w-maxContent mx-auto'
        >
            <div className='flex flex-col lg:flex-row w-full items-start gap-8 h-full'>
                {/* Main Content */}
                <div className='flex flex-1 flex-col'>
                    <h1 className='mb-6 text-3xl font-semibold text-[#111827]'>
                        Create New Course
                    </h1>
                    <p className='mb-8 text-[#6B7280]'>
                        Share your knowledge with students by creating a comprehensive course
                    </p>
                    
                    <div className='flex-1 overflow-auto h-full'>
                        <RenderSteps />
                    </div>
                </div>
                
                {/* Tips Section */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className='sticky top-10 hidden lg:block w-full max-w-[380px] rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm'
                >
                    <div className='flex items-center gap-2 mb-4'>
                        <div className='bg-[#EEF2FF] p-2 rounded-full'>
                            <FiInfo className='text-[#422FAF] text-xl' />
                        </div>
                        <h3 className='text-lg font-medium text-[#111827]'>Course Creation Tips</h3>
                    </div>
                    
                    <ul className='list-disc pl-5 space-y-3 text-sm text-[#4B5563]'>
                        <li>Set the Course Price option or make it free.</li>
                        <li>Standard size for the course thumbnail is 1024x576.</li>
                        <li>Video section controls the course overview video.</li>
                        <li>Course Builder is where you create & organize a course.</li>
                        <li>Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</li>
                        <li>Information from the Additional Data section shows up on the course single page.</li>
                        <li>Make Announcements to notify any important updates to all enrolled students at once.</li>
                        <li>Preview your course before publishing to ensure everything looks good.</li>
                    </ul>
                    
                    <div className='mt-6 p-3 bg-[#F3F4F6] rounded-lg border border-[#E5E7EB]'>
                        <p className='text-sm text-[#4B5563]'>
                            <span className='font-medium text-[#111827]'>Pro tip:</span> Take time to plan your course structure before starting to create content.
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default AddCourses