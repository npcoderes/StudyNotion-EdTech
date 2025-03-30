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
    <div className="flex flex-col gap-5 text-[#1E293B]">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-[#E2E8F0]">
          <Player
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
          >
            <BigPlayButton position="center" />
            {/* Render When Video Ends */}
            {videoEnded && (
              <div
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                }}
                className="absolute inset-0 z-[100] grid h-full place-content-center font-inter"
              >
                {!completedLectures.includes(subSectionId) && (
                  <IconBtn
                    disabled={loading}
                    onclick={() => handleLectureCompletion()}
                    text={!loading ? "Mark As Completed" : "Loading..."}
                    customClasses="text-xl max-w-max px-4 mx-auto bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                  />
                )}
                <IconBtn
                  disabled={loading}
                  onclick={() => {
                    if (playerRef?.current) {
                      // set the current time of the video to 0
                      playerRef?.current?.seek(0)
                      setVideoEnded(false)
                    }
                  }}
                  text="Rewatch"
                  customClasses="text-xl max-w-max px-4 mx-auto mt-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B]"
                />
                <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                  {!isFirstVideo() && (
                    <button
                      disabled={loading}
                      onClick={goToPrevVideo}
                      className="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] rounded-lg transition-all"
                    >
                      Previous
                    </button>
                  )}
                  {!isLastVideo() && (
                    <button
                      disabled={loading}
                      onClick={goToNextVideo}
                      className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg transition-all"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </Player>
        </div>
      )}

      <h1 className="mt-4 text-2xl font-semibold text-[#1E293B]">{videoData?.title}</h1>
      <p className="text-[#64748B]">{videoData?.description}</p>

      <div className="my-7 border-t border-[#E2E8F0] pt-6">
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
    </div>
  )
}

export default VideoDetails
