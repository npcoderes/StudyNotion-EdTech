import React from 'react'
import { useSelector } from 'react-redux'
import { FaCheck } from 'react-icons/fa'
import { HiOutlineDocumentText, HiOutlinePuzzle, HiOutlineClipboardCheck, HiOutlineGlobeAlt, HiLightBulb } from 'react-icons/hi'
import CourseInformationForm from './CourseInformation/CourseInformationForm'
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm'
import PublishCourse from './PublishCourse/PublishCourse'
import CourseExamForm from './CourseExam/CourseExamForm'
import { motion } from 'framer-motion'

export default function RenderSteps() {
  const { step, editCourse } = useSelector((state) => state.course)

  const steps = [
    {
      id: 1,
      title: "Course Information",
      icon: <HiOutlineDocumentText className="text-lg" />,
      description: "Basic details about your course"
    },
    {
      id: 2,
      title: "Course Builder",
      icon: <HiOutlinePuzzle className="text-lg" />,
      description: "Create sections and lessons"
    },
    {
      id: 3,
      title: "Course Exam",
      icon: <HiOutlineClipboardCheck className="text-lg" />,
      description: "Set up assessment questions"
    },
    {
      id: 4,
      title: "Publish",
      icon: <HiOutlineGlobeAlt className="text-lg" />,
      description: "Review and make it live"
    },
  ]

  // Animation variants for step transitions
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  // Get current step information
  const currentStep = steps.find(item => item.id === step) || steps[0]

  return (
    <div className="space-y-10">
      {/* Progress header with title and description */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1E293B] mb-2">
          {editCourse ? "Edit Your Course" : "Create New Course"}
        </h2>
        <p className="text-[#64748B]">
          {currentStep.description}
        </p>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="relative flex w-full justify-center mb-12">
        {steps.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="flex flex-col items-center relative">
              {/* Step circle with number or check icon */}
              <div
                className={`grid aspect-square w-[50px] h-[50px] place-items-center rounded-full border-[2px] transition-all duration-200 
                  ${
                    step === item.id
                      ? "border-[#3B82F6] bg-[#3B82F6] text-white shadow-md shadow-[#93C5FD]/40"
                      : step > item.id
                      ? "border-[#3B82F6] bg-[#3B82F6] text-white"
                      : "border-[#E2E8F0] bg-white text-[#94A3B8]"
                  }`}
              >
                {step > item.id ? (
                  <FaCheck className="font-bold text-white text-lg" />
                ) : (
                  item.icon || item.id
                )}
              </div>

              {/* Step label */}
              <p
                className={`text-sm font-medium mt-2 transition-colors duration-200 ${
                  step >= item.id ? "text-[#1E293B]" : "text-[#94A3B8]"
                }`}
              >
                {item.title}
              </p>
              
              {/* Active step indicator - small dot below active step */}
              {step === item.id && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-3 h-2 w-2 rounded-full bg-[#3B82F6]"
                ></motion.div>
              )}
            </div>
            
            {/* Connecting line between circles */}
            {item.id !== steps.length && (
              <div className="flex items-center w-[20%] md:w-[15%] lg:w-[10%] relative">
                <div
                  className={`h-[3px] w-full transition-colors duration-200 ${
                    step > item.id ? "bg-[#3B82F6]" : "bg-[#E2E8F0]"
                  }`}
                ></div>
                
                {/* Step progress animation */}
                {step === item.id && (
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                    className="absolute top-0 left-0 h-[3px] bg-[#93C5FD]"
                  ></motion.div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form container with enhanced animation */}
      <motion.div
        key={step}
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg border border-[#E2E8F0] p-8 shadow-sm"
      >
        <div className="mb-6 pb-4 border-b border-[#E2E8F0]">
          <h3 className="text-xl font-semibold text-[#1E293B] flex items-center">
            <span className="bg-[#3B82F6] text-white w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm shadow-sm">
              {step}
            </span>
            {currentStep.title}
          </h3>
        </div>
        
        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm />}
        {step === 3 && <CourseExamForm />}
        {step === 4 && <PublishCourse />}
      </motion.div>
      
      {/* Help tip with enhanced styling */}
      <div className="text-center bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg p-4 text-[#3B82F6] text-sm mt-6 flex items-center justify-center">
        <HiLightBulb className="text-[#3B82F6] text-xl mr-2" />
        <p>
          <span className="font-medium">Tip:</span> You can save your progress and return later to complete your course.
        </p>
      </div>
    </div>
  )
}