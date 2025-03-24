import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { MdArrowBack } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import { createSection, updateSection } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse, setStep, setStepOne } from "../../../../../slices/courseSlice"

import NestedView from "./NestedView"

export default function CourseBuilderForm() {
  const { register, handleSubmit, setValue, formState: { errors }, } = useForm()

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null) // stored section ID

  // handle form submission
  const onSubmit = async (data) => {
    setLoading(true)

    let result

    if (editSectionName) {
      result = await updateSection({ 
        sectionName: data.sectionName, 
        sectionId: editSectionName, 
        courseId: course._id, 
      }, token)
    } else {
      result = await createSection({ 
        sectionName: data.sectionName, 
        courseId: course._id, 
      }, token)
    }
    
    if (result) {
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("sectionName", "")
    }
    setLoading(false)
  }

  // cancel edit
  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  // Change Edit SectionName
  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  // go To Next
  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add at least one section")
      return
    }
    if (course.courseContent.some((section) => section.subSection.length === 0)) {
      toast.error("Please add at least one lecture in each section")
      return
    }

    // all set go ahead
    dispatch(setStep(3))
  }

  // go Back
  function goBack() {
    dispatch(setStepOne())
    dispatch(setEditCourse(true))
  }

  return (
    <div className="space-y-8 rounded-xl border border-[#E5E7EB] bg-white p-6">
      <h2 className="text-xl font-semibold text-[#111827]">Course Builder</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Section Name */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-[#4B5563]" htmlFor="sectionName">
            Section Name <span className="text-[#EF4444]">*</span>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="w-full px-4 py-2.5 text-[#111827] bg-white border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#422FAF] focus:border-[#422FAF] focus:outline-none transition-colors"
          />
          {errors.sectionName && (
            <span className="text-xs text-[#EF4444]">
              Section name is required
            </span>
          )}
        </div>

        {/* Edit Section Name OR Create Section */}
        <div className="flex items-end gap-x-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2.5 ${
              editSectionName 
              ? "bg-white text-[#422FAF] border border-[#422FAF]" 
              : "bg-[#422FAF] text-white"
            } rounded-lg hover:bg-opacity-90 transition-colors font-medium`}
          >
            <IoAddCircleOutline size={20} />
            {editSectionName ? "Update Section" : "Create Section"}
          </button>
          
          {/* if editSectionName mode is on */}
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-[#4B5563] bg-white border border-[#E5E7EB] rounded-lg px-4 py-2.5 hover:bg-[#F9FAFB] transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Nested view of section - subsection */}
      {course.courseContent.length > 0 && (
        <div className="mt-6">
          <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
        </div>
      )}

      {/* Next Prev Button */}
      <div className="flex justify-end gap-x-3 pt-4">
        <button
          onClick={goBack}
          className="flex items-center gap-1 px-5 py-2.5 border border-[#E5E7EB] text-[#4B5563] rounded-lg hover:bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#E5E7EB] transition-colors font-medium disabled:opacity-70"
        >
          <MdArrowBack />
          Back
        </button>

        {/* Next button */}
        <button
          onClick={goToNext}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#422FAF] text-white rounded-lg hover:bg-[#3B27A1] focus:outline-none focus:ring-2 focus:ring-[#422FAF] focus:ring-offset-2 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Next 
          <MdNavigateNext size={20} />
        </button>
      </div>
    </div>
  )
}