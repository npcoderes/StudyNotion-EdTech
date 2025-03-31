import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn"
import DoubtList from "../Doubt/DoubtList"
import CreateDoubt from "../Doubt/CreateDoubt "
import { getDoubtsByCourse } from "../../../services/operations/doubtService"
import { FaQuestionCircle, FaPencilAlt, FaLock } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { HiOutlineBadgeCheck } from 'react-icons/hi'
import { BiRewind } from 'react-icons/bi'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures, totalNoOfLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)
  const {user} = useSelector(state => state.profile)
  const [showDoubtForm, setShowDoubtForm] = useState(false)
  const [doubts, setDoubts] = useState([])
  const [isAllContentCompleted, setIsAllContentCompleted] = useState(false)

  // Check if all content is completed
  useEffect(() => {
    if (totalNoOfLectures && completedLectures) {
      setIsAllContentCompleted(completedLectures.length === totalNoOfLectures)
    }
  }, [completedLectures, totalNoOfLectures])

  const fetchDoubts = async () => {
    try {
      const response = await getDoubtsByCourse(courseId);
      console.log("doubts", response.data);
      setDoubts(response.data.doubts);
    } catch (error) {
      console.error("Error fetching doubts:", error);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, [courseId]);

  useEffect(() => {
    ;(async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )
        setVideoData(filteredVideoData[0])
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSectionIndx === 0 && currentSubSectionIndx === 0) {
      return true
    } else {
      return false
    }
  }

  // go to the next video
  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  // check if the lecture is the last video of the course
  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }

  // go to the previous video
  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-5 text-[#1E293B] max-w-[1200px] mx-auto">
      {!videoData ? (
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <img
            src={previewSource}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <p className="text-white text-xl font-medium">Loading video...</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0] shadow-xl bg-white">
          <Player
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
            fluid={true}
          >
            <BigPlayButton position="center" className="!bg-[#422FAF]/90 !border-none hover:!bg-[#422FAF] transition-all duration-200" />
            
            {/* Video End Overlay */}
            {videoEnded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-[100] bg-gradient-to-t from-black/95 via-black/70 to-transparent backdrop-blur-sm"
              >
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-8"
                >
                  {/* Completion Badge */}
                  {!completedLectures.includes(subSectionId) && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center"
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, -10, 10, 0]
                        }}
                        transition={{ 
                          duration: 0.5,
                          delay: 0.5,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      >
                        <HiOutlineBadgeCheck className="w-16 h-16 text-[#422FAF] mx-auto mb-4" />
                      </motion.div>
                      <IconBtn
                        disabled={loading}
                        onclick={() => handleLectureCompletion()}
                        text={!loading ? "Mark As Completed" : "Loading..."}
                        customClasses="text-lg font-medium px-8 py-4 rounded-xl bg-[#422FAF] hover:bg-[#3B27A1] text-white shadow-xl hover:shadow-[#422FAF]/25 transition-all duration-200"
                      />
                    </motion.div>
                  )}

                  {/* Video Controls */}
                  <div className="flex flex-col items-center gap-6">
                    <motion.button
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      disabled={loading}
                      onClick={() => {
                        if (playerRef?.current) {
                          playerRef?.current?.seek(0)
                          setVideoEnded(false)
                        }
                      }}
                      className="group flex items-center font-inter gap-3 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-200"
                    >
                      <BiRewind className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      Rewatch Lecture
                    </motion.button>

                    {/* Navigation Buttons */}
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-4"
                    >
                      {!isFirstVideo() && (
                        <button
                          disabled={loading}
                          onClick={goToPrevVideo}
                          className="group flex font-inter items-center gap-3 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-200"
                        >
                          <FiChevronsLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                          Previous Lecture
                        </button>
                      )}
                      
                      {!isLastVideo() && (
                        <button
                          disabled={loading}
                          onClick={goToNextVideo}
                          className="group flex font-inter items-center gap-3 px-6 py-3 rounded-xl bg-[#422FAF] hover:bg-[#3B27A1] text-white shadow-xl hover:shadow-[#422FAF]/25 transition-all duration-200"
                        >
                          Next Lecture
                          <FiChevronsRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </Player>
        </div>
      )}

      {/* Video Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#1E293B] mb-2">
              {videoData?.title}
            </h1>
            <p className="text-[#64748B] leading-relaxed">
              {videoData?.description}
            </p>
          </div>
          
          {completedLectures.includes(subSectionId) && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
              <HiOutlineBadgeCheck className="w-5 h-5" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>

        <div className="border-t border-[#E2E8F0] pt-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setShowDoubtForm(true)}
              className="flex items-center gap-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] px-4 py-2 rounded-lg transition-all"
            >
              <FaQuestionCircle className="text-[#3B82F6]" />
              Ask a Doubt
            </button>

            {courseEntireData?.hasExam && (
              <button
                onClick={() => navigate(`/view-course/${courseEntireData._id}/take-exam`)}
                disabled={!isAllContentCompleted}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${isAllContentCompleted 
                    ? "bg-[#3B82F6] hover:bg-[#2563EB] text-white" 
                    : "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed"}`}
              >
                {isAllContentCompleted 
                  ? <FaPencilAlt className="text-white" /> 
                  : <FaLock className="text-[#94A3B8]" />}
                {isAllContentCompleted 
                  ? "Take Exam" 
                  : "Complete all lectures to unlock exam"}
              </button>
            )}
          </div>

          {showDoubtForm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CreateDoubt 
                courseId={courseId} 
                onDoubtCreated={fetchDoubts} 
                onClose={() => setShowDoubtForm(false)}
              />
            </motion.div>
          )}

          <DoubtList 
            doubts={doubts} 
            isInstructor={false} 
            onUpdate={fetchDoubts} 
          />
        </div>
      </motion.div>
    </div>
  )
}

export default VideoDetails
