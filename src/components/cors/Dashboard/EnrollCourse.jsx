import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import Img from './../../common/Img';



export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)

  // fetch all users enrolled courses
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      console.log("res =============== ", res);
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.")
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, [])

  // Loading Skeleton
  const sklItem = () => {
    return (
      <div className="flex border border-richblack-700 p-4 rounded-lg animate-pulse">
        <div className="flex flex-1 gap-4">
          <div className="h-14 w-14 rounded-lg bg-richblack-500"></div>
          <div className="flex flex-col w-2/5">
            <div className="h-4 w-1/2 bg-richblack-500 rounded mb-2"></div>
            <div className="h-3 w-3/4 bg-richblack-500 rounded"></div>
          </div>
        </div>
        <div className="flex flex-col w-2/5">
          <div className="h-3 w-1/5 bg-richblack-500 rounded mb-2"></div>
          <div className="h-2 w-2/5 bg-richblack-500 rounded"></div>
        </div>
      </div>
    )
  }

  // return if data is null
  if (enrolledCourses?.length == 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] bg-richblack-900">
        <p className="text-3xl text-richblack-5 font-semibold">
          You have not enrolled in any course yet.
        </p>
      </div>)
  }



  return (
    <div className="bg-richblack-900 min-h-screen py-8">
      <div className="w-11/12 max-w-maxContent mx-auto">
        <h1 className="text-4xl font-boogaloo text-richblack-5 mb-8 text-center sm:text-left">
          Enrolled Courses
        </h1>
        <div className="bg-richblack-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-richblack-50 border-b border-richblack-700">
            <div className="col-span-5 sm:col-span-6">Course Name</div>
            <div className="col-span-3 sm:col-span-2">Duration</div>
            <div className="col-span-4">Progress</div>
          </div>
          {!enrolledCourses ? (
            <div className="space-y-4 p-4">
              {[...Array(5)].map((_, index) => (
                <div key={index}>{sklItem()}</div>
              ))}
            </div>
          ) : (
            <div>
              {enrolledCourses.map((course, index) => (
                <div
                  key={course._id}
                  className="grid grid-cols-12 gap-4 p-4 items-center border-b border-richblack-700 hover:bg-richblack-700 transition-colors duration-200"
                >
                  <div
                    className="col-span-5 sm:col-span-6 flex items-center gap-4 cursor-pointer"
                    onClick={() => navigate(`/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}
                  >
                    <Img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-richblack-5">{course.courseName}</p>
                      <p className="text-xs text-richblack-300 mt-1">
                        {course.courseDescription.length > 50
                          ? `${course.courseDescription.slice(0, 50)}...`
                          : course.courseDescription}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-richblack-50">
                    {course?.totalDuration}
                  </div>
                  <div className="col-span-4">
                    <p className="text-sm text-richblack-50 mb-2">
                      Progress: {course.progressPercentage || 0}%
                    </p>
                    <ProgressBar
                      completed={course.progressPercentage || 0}
                      height="8px"
                      isLabelVisible={false}
                      bgColor="#FFD60A"
                      baseBgColor="#2C333F"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}