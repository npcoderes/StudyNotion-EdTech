import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
import CourseDoubts from './CourseDoubts ';
import { motion } from 'framer-motion';
import { FiBook, FiChevronRight, FiUsers } from 'react-icons/fi';

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetchInstructorCourses(token);
        setCourses(response);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.6, 0.01, 0.3, 0.9]
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-8 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#422FAF] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-8">
        <h1 className="text-3xl font-semibold text-[#111827] mb-6">My Courses</h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl border border-[#E5E7EB] p-8 shadow-sm text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#EEF2FF] rounded-full mb-4">
            <FiBook className="text-2xl text-[#422FAF]" />
          </div>
          <h2 className="text-xl font-medium text-[#111827] mb-2">No Courses Available</h2>
          <p className="text-[#6B7280] mb-6">You haven't created any courses yet. Start by creating your first course.</p>
          <button 
            className="px-4 py-2.5 bg-[#422FAF] text-white rounded-lg hover:bg-[#3B27A1] transition-colors"
            onClick={() => window.location.href = '/dashboard/add-course'}
          >
            Create New Course
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#111827] mb-2">My Courses</h1>
        <p className="text-[#6B7280]">Select a course to view and manage its student doubts</p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {courses.map(course => (
          <motion.div 
            key={course._id}
            variants={itemVariants}
            className={`bg-white p-6 rounded-xl border ${
              selectedCourse?._id === course._id 
                ? 'border-[#422FAF] shadow-lg' 
                : 'border-[#E5E7EB] shadow-sm'
            } cursor-pointer hover:shadow-md transition-all duration-200`}
            onClick={() => setSelectedCourse(course)}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={course.thumbnail || "https://via.placeholder.com/100"}
                  alt={course.courseName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-medium text-[#111827] mb-1 line-clamp-1">
                  {course.courseName}
                </h2>
                <div className="flex items-center text-[#6B7280] text-sm mb-2">
                  <FiUsers className="mr-1" />
                  <span>{course.studentsEnrolled?.length || 0} students</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === 'Published' 
                      ? 'bg-[#DCFCE7] text-[#15803D]' 
                      : 'bg-[#FEF3C7] text-[#B45309]'
                  }`}>
                    {course.status || 'Draft'}
                  </span>
                  <FiChevronRight className={`${
                    selectedCourse?._id === course._id ? 'text-[#422FAF]' : 'text-[#9CA3AF]'
                  }`} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {selectedCourse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#E5E7EB]">
            <img 
              src={selectedCourse.thumbnail || "https://via.placeholder.com/40"} 
              alt={selectedCourse.courseName}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <h2 className="text-xl font-medium text-[#111827]">
              {selectedCourse.courseName} - Doubts
            </h2>
          </div>
          <CourseDoubts courseId={selectedCourse._id} name={selectedCourse?.courseName} />
        </motion.div>
      )}
    </div>
  );
};

export default InstructorCourses;