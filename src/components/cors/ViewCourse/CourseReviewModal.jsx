import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import ReactStars from "react-rating-stars-component"
import { useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { FaPen } from "react-icons/fa"
import toast from "react-hot-toast"

import { createRating, checkRating } from "../../../services/operations/courseDetailsAPI"

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)
  const [existingReview, setExistingReview] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseRating: 0,
      courseExperience: ''
    }
  })

  // Watch the rating value
  const currentRating = watch('courseRating')

  // Check for existing review when modal opens
  useEffect(() => {
    const fetchExistingReview = async () => {
      try {
        const response = await checkRating(courseEntireData._id, token)
        if (response.exists) {
          console.log("Existing review found:", response)
          setExistingReview(response.rating)
          // Pre-fill form with existing review data
          setValue("courseExperience", response.rating.review)
          setValue("courseRating", response.rating.rating)
        }
      } catch (error) {
        console.error("Error fetching existing review:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchExistingReview()
  }, [courseEntireData._id, token, setValue])

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating)
  }

  const onSubmit = async (data) => {
    if (!data.courseRating) {
      toast.error("Please provide a rating")
      return
    }
    
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    )
    setReviewModal(false)
  }

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[1000] grid place-items-center bg-black/20 backdrop-blur-sm"
      >
        <div className="flex items-center space-x-2 text-white">
          <div className="w-4 h-4 bg-[#422FAF] rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-[#422FAF] rounded-full animate-pulse delay-75"></div>
          <div className="w-4 h-4 bg-[#422FAF] rounded-full animate-pulse delay-150"></div>
        </div>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-black/20 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="my-10 w-11/12 max-w-[700px] rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] p-6 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <span className="bg-[#422FAF] p-2 rounded-lg text-white">
                <FaPen className="text-lg" />
              </span>
              <p className="text-xl font-semibold text-[#111827]">
                {existingReview ? "Edit Your Review" : "Share Your Learning Experience"}
              </p>
            </div>
            <button 
              onClick={() => setReviewModal(false)}
              className="text-[#6B7280] hover:text-[#111827] transition-all duration-200"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-8">
            {/* User Info Section */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center justify-center gap-x-4 bg-[#F9FAFB] p-6 rounded-xl border border-[#E5E7EB]"
            >
              <img
                src={user?.image}
                alt={user?.firstName + "profile"}
                className="aspect-square w-[70px] rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div>
                <p className="font-semibold text-xl text-[#111827]">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-[#6B7280]">
                  {existingReview ? (
                    <>
                      Last updated • {new Date(existingReview.updatedAt).toLocaleDateString()}
                    </>
                  ) : (
                    <>
                      Posting Publicly • {new Date().toLocaleDateString()}
                    </>
                  )}
                </p>
              </div>
            </motion.div>

            {/* Review Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col items-center"
            >
              <div className="mb-8">
                <p className="text-center text-sm text-[#6B7280] mb-3 font-medium">
                  Rate this course
                </p>
                <ReactStars
                  key={`stars-${currentRating}`} // Add key to force re-render
                  count={5}
                  onChange={ratingChanged}
                  size={40}
                  value={currentRating || existingReview?.rating || 0}
                  activeColor="#422FAF"
                  color="#E5E7EB"
                  isHalf={true}
                />
              </div>

              <div className="flex w-full flex-col space-y-2">
                <label
                  className="text-sm text-[#6B7280] font-medium"
                  htmlFor="courseExperience"
                >
                  Your review <sup className="text-red-500">*</sup>
                </label>
                <textarea
                  id="courseExperience"
                  placeholder="Share what you loved about the course and how it benefited you..."
                  defaultValue={existingReview?.review || ""}
                  {...register("courseExperience", { required: true })}
                  className="min-h-[180px] w-full rounded-xl border border-[#E5E7EB] bg-white p-4 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#422FAF] transition-all duration-200 resize-none"
                />
                {errors.courseExperience && (
                  <span className="ml-2 text-xs tracking-wide text-red-500">
                    Please share your experience with the course
                  </span>
                )}
              </div>

              <div className="mt-8 flex w-full justify-end gap-x-4">
                <button
                  type="button"
                  onClick={() => setReviewModal(false)}
                  className="px-6 py-3 rounded-lg border border-[#E5E7EB] text-[#6B7280] font-medium hover:bg-[#F9FAFB] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-[#422FAF] text-white font-medium hover:bg-[#3B27A1] transition-all duration-200 flex items-center gap-2"
                >
                  <FaPen className="text-sm" />
                  {existingReview ? "Update Review" : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
