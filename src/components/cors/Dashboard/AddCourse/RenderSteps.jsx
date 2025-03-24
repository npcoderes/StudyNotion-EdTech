import React from "react"
import { FaCheck } from "react-icons/fa"
import { useSelector } from "react-redux"

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm"
import CourseInformationForm from "./CourseInformation/CourseInformationForm"
import PublishCourse from "./PublishCourse/PublishCourse"
import { motion } from "framer-motion"

export default function RenderSteps() {
  const { step, editCourse } = useSelector((state) => state.course)

  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ]

  // Animation variants for step transitions
  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  }

  return (
    <>
      {/* Progress Steps */}
      <div className="mb-8 flex w-full select-none justify-center">
        {steps.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="flex flex-col items-center">
              <div
                className={`grid aspect-square w-[40px] place-items-center rounded-full border
                  ${
                    step === item.id
                      ? "border-[#422FAF] bg-[#EEF2FF] text-[#422FAF] font-medium"
                      : step > item.id
                        ? "bg-[#422FAF] text-white border-[#422FAF]"
                        : "border-[#D1D5DB] bg-white text-[#6B7280]"
                  }`}
              >
                {step > item.id ? (
                  <FaCheck className="text-white" />
                ) : (
                  item.id
                )}
              </div>
              
              {/* Step Title */}
              <p className={`mt-2 text-sm ${
                step >= item.id 
                  ? "text-[#111827] font-medium" 
                  : "text-[#6B7280]"
              }`}>
                {item.title}
              </p>
            </div>

            {/* Connector Line */}
            {item.id !== steps.length && (
              <div className="flex items-center w-[20%] mx-2">
                <div
                  className={`h-[2px] w-full ${
                    step > item.id 
                      ? "bg-[#422FAF]" 
                      : "bg-[#E5E7EB]"
                  }`}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content Container */}
      <motion.div
        key={step}
        variants={stepVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6"
      >
        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm />}
        {step === 3 && <PublishCourse />}
      </motion.div>
    </>
  )
}