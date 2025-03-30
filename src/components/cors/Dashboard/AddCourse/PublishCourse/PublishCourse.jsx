import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { MdArrowBack } from "react-icons/md"
import { toast } from "react-hot-toast"

import { editCourseDetails, createCourse } from "../../../../../services/operations/courseDetailsAPI"
import { resetCourseState, setStep, setEditCourse } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"

const PublishCourse = () => {
  const { register, handleSubmit, setValue, getValues } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [thumbnail, setThumbnail] = useState(null)
  const [status, setStatus] = useState(COURSE_STATUS.DRAFT)

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true)
    }
  }, [])

  const goBack = () => {
    dispatch(setStep(3))
    dispatch(setEditCourse(true))
  }

  const goToCourses = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }

  const handleCourseSubmission = async () => {
    // Validate if thumbnail is there or not
    // If course is being edited and thumbnail exists, no need to check
    if (!thumbnail && !course.thumbnail) {
      toast.error("Please upload a thumbnail")
      return
    }

    // Create form data
    const formData = new FormData()

    formData.append("courseId", course._id)
    formData.append("courseName", course.courseName)
    formData.append("courseDescription", course.courseDescription)
    formData.append("coursePrice", course.price)
    formData.append("courseBenefits", course.benefits)
    formData.append("courseCategory", course.category)
    formData.append("courseRequirements", JSON.stringify(course.requirements))
    formData.append("courseInstructions", JSON.stringify(course.instructions))
    formData.append("status", status)
    formData.append("tag", JSON.stringify(course.tag))

    // Add exam data if it exists
    if (course.hasExam) {
      formData.append("hasExam", course.hasExam)
      formData.append("exam", JSON.stringify(course.exam))
    }

    // If thumbnail exists, add it to formData
    if (thumbnail) {
      formData.append("thumbnailImage", thumbnail)
    }

    // Make the API call
    setLoading(true)
    const result = await createCourse(formData, token)
    setLoading(false)

    if (result) {
      dispatch(resetCourseState())
      navigate("/dashboard/my-courses")
    }
  }

  const handleCoursePublish = async () => {
    // check if form has been updated or not
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      // form has not been updated
      // no need to make api call
      goToCourses()
      return
    }
    const formData = new FormData()
    formData.append("courseId", course._id)
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT
    formData.append("status", courseStatus)
    setLoading(true)
    const result = await editCourseDetails(formData, token)
    if (result) {
      goToCourses()
    }
    setLoading(false)
  }

  const onSubmit = () => {
    handleCoursePublish()
  }

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#111827] mb-6">
        Publish Settings
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox */}
        <div className="my-8">
          <label htmlFor="public" className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="h-5 w-5 rounded border-[#D1D5DB] text-[#422FAF] focus:ring-2 focus:ring-[#422FAF] focus:ring-offset-2"
            />
            <span className="ml-3 text-[#4B5563] text-base">
              Make this course public
            </span>
          </label>
          <p className="mt-2 text-sm text-[#6B7280] ml-8">
            Publishing your course will make it visible to students in the course catalog
          </p>
        </div>

        {/* Next Prev Button */}
        <div className="flex justify-end items-center gap-x-4 mt-10">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex items-center gap-1 px-5 py-2.5 border border-[#E5E7EB] text-[#4B5563] rounded-lg hover:bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#E5E7EB] transition-colors font-medium disabled:opacity-70"
          >
            <MdArrowBack />
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#422FAF] text-white rounded-lg hover:bg-[#3B27A1] focus:outline-none focus:ring-2 focus:ring-[#422FAF] focus:ring-offset-2 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Processing...
              </>
            ) : (
              "Save & Publish"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PublishCourse