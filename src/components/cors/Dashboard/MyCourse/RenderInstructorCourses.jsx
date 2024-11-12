import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { apiConnector } from "../../../../services/apiconnector";
import { profileEndpoints } from "../../../../services/apis";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { deleteCourse } from "../../../../services/operations/courseDetailsAPI";
import { useNavigate } from "react-router-dom";

const RenderInstructorCourses = () => {
  const trUNCATE_LENGth = 25;
  const { token } = useSelector((state) => state.auth);
  const [EnrollCourse, setEnrollCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const navigate = useNavigate();

  const fetchenroll = async () => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("GET", profileEndpoints.GET_USER_ENROLLED_COURSES_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      setEnrollCourse(response.data.data);
      console.log( "EnrollCourse_instructor......",EnrollCourse)
    } catch (err) {
      console.error("Error fetching enrolled courses", err);
      toast.error("Failed to load courses");
    }
    toast.dismiss(toastId);
  };

  useEffect(() => {
    fetchenroll();
 
  }, []);

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    try {
      await deleteCourse({ courseId }, token);
      await fetchenroll(); // Refresh the course list after deletion
      setConfirmationModal(null);
    } catch (e) {
      console.error("Error deleting course", e);
      toast.error("Error deleting course");
    } finally {
      setLoading(false);
    }
  };

  const formatdate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Improved date formatting
  };

  return (
    <>
      <table className="rounded-2xl  mt-5 shadow-lg">
        <thead>
          <tr className="flex gap-x-6 rounded-t-3xl border-b border-b-[#4B5563] bg-[#1F2937] text-white px-6 py-4">
            <th className="flex-1 text-left text-lg font-medium uppercase">Courses</th>
            <th className="text-left text-lg font-medium uppercase">Duration</th>
            <th className="text-left text-lg font-medium uppercase">Price</th>
            <th className="text-left text-lg font-medium uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!EnrollCourse || EnrollCourse.length === 0 ? (
            <tr>
              <td className="py-10 text-center text-2xl font-medium text-[#D1D5DB]">No courses found</td>
            </tr>
          ) : (
            EnrollCourse.map((course) => (
              <tr key={course._id} className="flex gap-x-10 border-b border-[#4B5563] px-6 py-8 transition-colors duration-300">
                <td className="flex flex-1 gap-x-7 ">
                  <img src={course?.thumbnail} alt={course?.courseName} className="h-[148px] min-w-[270px] max-w-[270px] rounded-lg object-cover shadow-md" />
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold text-[#000] capitalize">{course.courseName}</p>
                    <p className="text-xs text-[#000]">
                      {course.courseDescription.split(" ").length > trUNCATE_LENGth
                        ? `${course.courseDescription.split(" ").slice(0, trUNCATE_LENGth).join(" ")}...`
                        : course.courseDescription}
                    </p>
                    <p className="text-[12px] text-[#000] mt-4">Created: {formatdate(course?.createdAt)}</p>
                    <p className="text-[12px] text-[#000]">Updated: {formatdate(course?.updatedAt)}</p>
                    <p className={`mt-2 flex w-fit flex-row items-center gap-2 rounded-full px-2 py-[2px] text-[12px] font-medium ${course.status === COURSE_STATUS.DRAFT ? 'bg-[#D53F8C] text-white' : 'bg-[#FBBF24] text-white'}`}>
                      {course.status === COURSE_STATUS.DRAFT ? <HiClock size={14} /> : <FaCheck size={8} />}
                      {course.status === COURSE_STATUS.DRAFT ? 'Drafted' : 'Published'}
                    </p>
                  </div>
                </td>
                <td className="text-sm font-medium text-[#000]">{course?.totalDuration}</td>
                <td className="text-sm font-medium text-[#000]">₹{course.price}</td>
                <td className="text-sm font-medium text-[#000] flex gap-2">
                  <button
                    disabled={loading}
                    onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-[#00BFFF]"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2: "All the data related to this course will be deleted",
                        btn1Text: loading ? "Loading..." : "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: !loading ? () => handleCourseDelete(course._id) : () => {},
                        btn2Handler: () => setConfirmationModal(null),
                      });
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#FF0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default RenderInstructorCourses;
