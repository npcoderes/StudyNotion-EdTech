
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import { getFullDetailsOfCourse, } from "../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import RenderSteps from "../AddCourse/RenderSteps"
import toast from "react-hot-toast"


export default function EditCourse() {
  const dispatch = useDispatch()
  const { courseId } = useParams()
  console.log("Course ID: " + courseId)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  // console.log('before course data = ', course)

  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const fetchFullCourseDetails = async () => {
      setLoading(true)
      const result = await getFullDetailsOfCourse(courseId, token);
      // console.log('Data from edit course file = ', result)
      if (result?.courseDetails) {
        dispatch(setEditCourse(true))
        dispatch(setCourse(result?.courseDetails))
      }
      setLoading(false)
    }

    fetchFullCourseDetails();
  }, [])

  // Loading
  if (loading) {
    return <></>
  }

  return (
    <div className="flex w-full items-start gap-x-6">

      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-medium text-richblack-5 text-center sm:text-left">
          Edit Course
        </h1>

        {loading ? <></>
          :
          (<div className="flex-1">
            {course ? <RenderSteps />
              :
              (<p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
                Course not found
              </p>)
            }
          </div>)}
      </div>



    </div>
  )
}
