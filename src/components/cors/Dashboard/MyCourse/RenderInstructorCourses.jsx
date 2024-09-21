import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { apiConnector } from "../../../../services/apiconnector";
import { profileEndpoints } from "../../../../services/apis";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { deleteCourse } from "../../../../services/operations/courseDetailsAPI";
import { useNavigate } from "react-router-dom";

const RenderInstructorCourses = () => {
  const TRUNCATE_LENGTH = 25
  const { token } = useSelector((state) => state.auth);
  const [EnrollCourse, setEnrollCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null); 
const navigate= useNavigate()
  const fetchenroll = async () => {
    const toastId = toast.loading("Loading...");

    try {
      console.log("Before calling EnrollCourse");
      const response = await apiConnector(
        "GET",
        profileEndpoints.GET_USER_ENROLLED_COURSES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      console.log("After calling EnrollCourse", response.data);
      setEnrollCourse(response.data.data);
    } catch (err) {
      console.log("Something happend when fetching enroll course", err);
    }
    toast.dismiss(toastId);
  };
  useEffect(() => {
    fetchenroll();
  }, []);

  // delete cours point 
  const handleCourseDelete =async(courseId)=>{
     setLoading(true);
     try{
      await deleteCourse ({courseId}, token);
      const cour = await apiConnector(
        "GET",
        profileEndpoints.GET_USER_ENROLLED_COURSES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if(cour)
      {
       setEnrollCourse(cour.data.data);
      }
      setConfirmationModal(null);
      setLoading(false);

     }catch(e){
       console.log("Error deleting course", e);
       toast.error("Error deleting course");
       setLoading(false);
     }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
    <Table className="rounded-2xl border border-richblack-800 mt-5 ">
      {/* heading */}
      <Thead>
        <Tr className="flex gap-x-6 rounded-t-3xl border-b border-b-richblack-700 px-6 py-2">
          <Th className="flex-1 text-left text-lg font-medium uppercase text-richblack-100">
            Courses
          </Th>
          <Th className="text-left text-lg font-medium uppercase text-richblack-100">
            Duration
          </Th>
          <Th className="text-left text-lg font-medium uppercase text-richblack-100">
            Price
          </Th>
          <Th className="text-left text-lg font-medium uppercase text-richblack-100">
            Actions
          </Th>
        </Tr>
      </Thead>




      <Tbody>
        {!EnrollCourse && EnrollCourse?.length === 0 ? (
          <Tr>
            <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
              No courses found
            </Td>
          </Tr>
        )
          : (
            EnrollCourse?.map((course) => (
              <Tr
                key={course._id}
                className="flex gap-x-10 border-b border-richblack-700 px-6 py-8"
              >
                <Td className="flex flex-1 gap-x-7 relative">
                  {/* course Thumbnail */}
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-[148px] min-w-[270px] max-w-[270px] rounded-lg object-cover"
                  />

                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold text-richblack-5 capitalize">{course.courseName}</p>
                    <p className="text-xs text-richblack-300 ">
                      {course.courseDescription.split(" ").length > TRUNCATE_LENGTH
                        ? course.courseDescription
                          .split(" ")
                          .slice(0, TRUNCATE_LENGTH)
                          .join(" ") + "..."
                        : course.courseDescription}
                    </p>

                    {/* created At */}
                    <p className="text-[12px] text-richblack-100 mt-4">
                      Created: {formatDate(course?.createdAt)}
                    </p>

                    {/* updated At */}
                    <p className="text-[12px] text-richblack-100 ">
                      updated: {formatDate(course?.updatedAt)}
                    </p>

                    {/* course status */}
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="mt-2 flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        Drafted
                      </p>)
                      :
                      (<div className="mt-2 flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                        <p className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </p>
                        Published
                      </div>
                      )}
                  </div>
                </Td>

                {/* course duration */}
                <Td className="text-sm font-medium text-richblack-100">2hr 30min</Td>
                <Td className="text-sm font-medium text-richblack-100">₹{course.price}</Td>

                <Td className="text-sm font-medium text-richblack-100 ">
                  {/* Edit button */}
                  <button
                    disabled={loading}
                    onClick={() => { navigate(`/dashboard/edit-course/${course._id}`) }}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                  </button>

                  {/* Delete button */}
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data related to this course will be deleted",
                        btn1Text: !loading ? "Delete" : "Loading...  ",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => { },
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => { },

                      })
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
      </Tbody> 
    </Table>
    {
      confirmationModal && (
        <ConfirmationModal
          modalData={confirmationModal}
        />
      )
    }
    </>
  );
};

export default RenderInstructorCourses;
