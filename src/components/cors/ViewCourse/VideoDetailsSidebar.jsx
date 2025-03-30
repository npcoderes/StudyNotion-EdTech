import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { FaDownload, FaStar } from "react-icons/fa"
import { motion } from "framer-motion"

import IconBtn from "../../common/IconBtn"
import axios from "axios"

export default function VideoDetailsSidebar({ setReviewModal }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)
  const { token } = useSelector(state => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ; (() => {
      if (!courseSectionData.length) return
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      )
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.subSection.findIndex((data) => data._id === subSectionId)
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection?.[
          currentSubSectionIndx
        ]?._id
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
      setVideoBarActive(activeSubSectionId)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname])

  let courseId = courseEntireData?._id
  const [certificate, setCertificate] = useState(() => {
    return localStorage.getItem(`certificate_${courseId}`) || null
  })

  const checkCourseCompleted = async () => {
    try {
      setIsLoading(true)
      const res = await axios.post(
        `${BASE_URL}/course/checkCourseCompleted`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (res.data.certificateURL) {
        setCertificate(res.data.certificateURL)
        localStorage.setItem(`certificate_${courseId}`, res.data.certificateURL)
      }
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (courseId) {
      setCertificate(null)
      localStorage.removeItem(`certificate_${courseId}`)
      checkCourseCompleted()
    }
    
    return () => {
      setIsLoading(false)
    }
  }, [courseId, token, location.pathname, completedLectures])

  return (
    <div className="flex w-[320px] max-w-[350px] flex-col border-r border-[#E2E8F0] bg-[#F8FAFC]">
      <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-[#E2E8F0] py-5">
        <div className="flex w-full items-center justify-between">
          <button
            onClick={() => {
              navigate(`/dashboard/enrolled-courses`)
            }}
            className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] transition-all"
            title="Back to courses"
          >
            <IoIosArrowBack size={24} />
          </button>
          <IconBtn
            text="Add Review"
            customClasses="ml-auto bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] flex items-center gap-2"
            onclick={() => setReviewModal(true)}
          >
            <FaStar className="text-[#F59E0B]" />
          </IconBtn>
        </div>
        
        <div className="flex flex-col w-full">
          <h2 className="text-lg font-semibold text-[#1E293B] mb-1">{courseEntireData?.courseName}</h2>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#64748B] font-medium">
              {completedLectures?.length} / {totalNoOfLectures} lectures completed
            </p>
            
            <div className="w-24 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#3B82F6] rounded-full"
                style={{ 
                  width: `${totalNoOfLectures ? (completedLectures?.length / totalNoOfLectures) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
          
          {certificate && (
            <motion.button
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => window.open(certificate, "_blank")}
              className="mt-4 flex items-center gap-2 rounded-lg bg-[#ECFDF5] border border-[#D1FAE5] px-4 py-2 text-sm font-medium text-[#059669] hover:bg-[#D1FAE5] transition-all"
            >
              <FaDownload />
              View Certificate
            </motion.button>
          )}
        </div>
      </div>

      <div className="h-[calc(100vh-5rem)] overflow-y-auto">
        {courseSectionData.map((course, index) => (
          <div
            className="mt-1 cursor-pointer text-sm"
            onClick={() => setActiveStatus(course?._id)}
            key={index}
          >
            <div className="flex flex-row justify-between bg-[#F1F5F9] px-5 py-4 hover:bg-[#E2E8F0] transition-all">
              <div className="w-[70%] font-medium text-[#334155]">
                {course?.sectionName}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`${activeStatus === course?._id
                    ? "rotate-180"
                    : "rotate-0"
                    } transition-all duration-300 text-[#64748B]`}
                >
                  <BsChevronDown />
                </span>
              </div>
            </div>

            {activeStatus === course?._id && (
              <div className="transition-all duration-300 ease-in-out">
                {course.subSection.map((topic, i) => (
                  <div
                    className={`flex items-center gap-3 px-5 py-3 border-l-2 ${videoBarActive === topic._id
                      ? "bg-[#EFF6FF] border-l-[#3B82F6] font-medium text-[#1E293B]"
                      : "border-transparent hover:bg-[#F1F5F9] text-[#475569]"
                      } transition-all`}
                    key={i}
                    onClick={() => {
                      navigate(
                        `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                      )
                      setVideoBarActive(topic._id)
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={completedLectures.includes(topic?._id)}
                      readOnly
                      className="w-4 h-4 rounded text-[#3B82F6] border-[#94A3B8] focus:ring-[#3B82F6] cursor-pointer"
                    />
                    <span className="truncate">{topic.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
