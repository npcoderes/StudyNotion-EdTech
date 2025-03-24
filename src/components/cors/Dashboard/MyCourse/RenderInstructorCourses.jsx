import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Icons
import { FaCheck } from "react-icons/fa";
import { FiEdit2, FiEye } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";

// API and Services
import { apiConnector } from "../../../../services/apiconnector";
import { profileEndpoints } from "../../../../services/apis";
import { deleteCourse } from "../../../../services/operations/courseDetailsAPI";

// Constants and Components
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";

const RenderInstructorCourses = () => {
  const TRUNCATE_LENGTH = 25;
  const { token } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await apiConnector(
        "GET", 
        profileEndpoints.GET_USER_ENROLLED_COURSES_API, 
        null, 
        { Authorization: `Bearer ${token}` }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      setCourses(response.data.data);
    } catch (err) {
      console.error("Error fetching courses", err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    try {
      await deleteCourse({ courseId }, token);
      toast.success("Course deleted successfully");
      await fetchCourses(); // Refresh the course list after deletion
      setConfirmationModal(null);
    } catch (e) {
      console.error("Error deleting course", e);
      toast.error("Error deleting course");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-10 w-10 border-4 border-[#422FAF] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-[#EEF2FF] rounded-full p-4 mb-4">
          <HiClock className="text-3xl text-[#422FAF]" />
        </div>
        <h3 className="text-xl font-medium text-[#111827] mb-2">No courses found</h3>
        <p className="text-[#6B7280] mb-6 max-w-md">
          You haven't created any courses yet. Start building your first course to share your knowledge.
        </p>
        <button 
          onClick={() => navigate('/dashboard/add-course')}
          className="px-4 py-2.5 bg-[#422FAF] text-white rounded-lg hover:bg-[#3B27A1] transition-colors"
        >
          Create New Course
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E5E7EB]">
          <thead>
            <tr className="bg-[#F9FAFB] text-[#4B5563]">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-28">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-24">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-28">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#E5E7EB]">
            {courses.map((course) => (
              <motion.tr 
                key={course._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-[#F9FAFB]"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={course?.thumbnail} 
                      alt={course?.courseName} 
                      className="h-16 w-24 object-cover rounded-md shadow-sm" 
                    />
                    <div>
                      <div className="text-sm font-medium text-[#111827]">{course.courseName}</div>
                      <div className="text-xs text-[#6B7280] mt-1 max-w-xs line-clamp-2">
                        {course.courseDescription}
                      </div>
                      <div className="text-xs text-[#6B7280] mt-2">
                        Created: {formatDate(course?.createdAt)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                  {course?.totalDuration || "Not set"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B5563]">
                  ₹{course.price.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    course.status === COURSE_STATUS.DRAFT 
                      ? 'bg-[#FEF3C7] text-[#B45309]' 
                      : 'bg-[#DCFCE7] text-[#15803D]'
                  }`}>
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <><HiClock className="mr-1" /> Draft</>
                    ) : (
                      <><FaCheck className="mr-1" /> Published</>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/courses/${course._id}`)}
                      title="View Course"
                      className="text-[#4B5563] hover:text-[#422FAF] transition-colors"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                      title="Edit Course"
                      className="text-[#4B5563] hover:text-[#422FAF] transition-colors"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => {
                        setConfirmationModal({
                          text1: "Delete Course",
                          text2: "Are you sure you want to delete this course? This action cannot be undone.",
                          btn1Text: loading ? "Deleting..." : "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: !loading ? () => handleCourseDelete(course._id) : () => {},
                          btn2Handler: () => setConfirmationModal(null),
                        });
                      }}
                      title="Delete Course"
                      className="text-[#4B5563] hover:text-[#EF4444] transition-colors"
                    >
                      <RiDeleteBin6Line size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default RenderInstructorCourses;