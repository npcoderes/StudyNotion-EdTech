import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap, FaClock, FaChartLine } from "react-icons/fa";
import { BsArrowRightShort } from "react-icons/bs";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import toast from "react-hot-toast";

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Status configuration with enhanced styling
  const statusConfig = {
    EXPIRED: { bg: '#FEE2E2', text: '#DC2626', dot: '#B91C1C', icon: '⚠️' },
    EXPIRING: { bg: '#FEF3C7', text: '#D97706', dot: '#B45309', icon: '⏰' },
    ACTIVE: { bg: '#D1FAE5', text: '#059669', dot: '#047857', icon: '✓' },
    INVALID: { bg: '#F3F4F6', text: '#4B5563', dot: '#374151', icon: '?' }
  };

  // Fetch user's enrolled courses
  const getEnrolledCourses = async () => {
    setIsLoading(true);
    try {
      const res = await getUserEnrolledCourses(token);
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.");
      toast.error("Failed to load your courses");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate course expiry status
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'INVALID', text: 'No expiry date' };
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { status: 'EXPIRED', text: 'Access Expired' };
    if (daysLeft < 7) return { status: 'EXPIRING', text: `${daysLeft} days left` };
    return { status: 'ACTIVE', text: `${daysLeft} days remaining` };
  };
  
  useEffect(() => {
    getEnrolledCourses();
  }, []);
  
  // Expiry status badge component
  const ExpiryStatus = ({ expireTime }) => {
    const { status, text } = getExpiryStatus(expireTime);
    const config = statusConfig[status] || statusConfig.INVALID;

    return (
      <div
        className="px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 shadow-sm transition-all duration-200 hover:shadow"
        style={{ backgroundColor: config.bg, color: config.text }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: config.dot }}
        ></span>
        {text}
      </div>
    );
  };

  // Enhanced course card component
  const CourseCard = ({ course }) => {
    const navigateToContent = () => {
      if (course.courseContent?.length > 0 && course.courseContent[0]?.subSection?.length > 0) {
        navigate(`/view-course/${course._id}/section/${course.courseContent[0]._id}/sub-section/${course.courseContent[0].subSection[0]._id}`);
      } else {
        toast.error("Course content is not available");
      }
    };

    return (
      <div className="group p-5 transition-all duration-300 hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 items-start lg:items-center">
          {/* Course Info */}
          <div className="w-full lg:col-span-5 flex items-start gap-4">
            {/* Thumbnail */}
            <div 
              onClick={navigateToContent}
              className="relative h-24 w-24 lg:h-20 lg:w-20 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 border border-[#E5E7EB] shadow-sm group-hover:shadow-md transition-all duration-300"
            >
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="bg-white rounded-full p-1.5 scale-0 group-hover:scale-100 transition-transform duration-300">
                  <BsArrowRightShort className="text-[#422FAF] w-4 h-4" />
                </div>
              </div>
            </div>
  
            {/* Course Details */}
            <div className="flex-1 min-w-0">
              <h3 
                onClick={navigateToContent}
                className="font-semibold text-lg lg:text-base text-[#111827] cursor-pointer hover:text-[#422FAF] transition-colors duration-200 line-clamp-2 group-hover:font-bold"
              >
                {course.courseName}
              </h3>
              <p className="text-sm text-[#6B7280] mt-1 line-clamp-1 group-hover:line-clamp-2 transition-all duration-300">
                {course.courseDescription.slice(0,100)+"..." || "Learn exciting skills and advance your career"}
              </p>
              
              <div className="hidden sm:flex items-center gap-3 mt-2">
                <ExpiryStatus expireTime={course.expireTime} />
              </div>
            </div>
          </div>
  
          {/* Stats Section */}
          <div className="w-full lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-4 items-center mt-3 lg:mt-0">
            {/* Duration */}
            <div className="sm:col-span-1 lg:col-span-3 text-[#4B5563] flex items-center gap-2">
              <FaClock className="w-3.5 h-3.5 text-[#422FAF]" />
              <span className="text-sm whitespace-nowrap font-medium">{course.totalDuration || 'N/A'}</span>
            </div>
  
            {/* Progress Bar */}
            <div className="sm:col-span-2 lg:col-span-6">
              <div className="flex justify-between text-xs text-[#6B7280] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <FaChartLine className="w-3 h-3 text-[#422FAF]" />
                  <span>Progress</span>
                </span>
                <span className="font-medium text-[#111827]">{course.progressPercentage || 0}%</span>
              </div>
              <ProgressBar
                completed={course.progressPercentage || 0}
                height="8px"
                isLabelVisible={false}
                bgColor={course.progressPercentage >= 100 ? '#059669' : '#422FAF'}
                baseBgColor="#E5E7EB"
                transitionDuration="0.5s"
                className="rounded-full overflow-hidden"
              />
            </div>
  
            {/* Continue Button / Mobile Expiry Status */}
            <div className="sm:hidden flex items-center gap-3 mb-2">
              <ExpiryStatus expireTime={course.expireTime} />
            </div>

            {/* Continue Button */}
            <div className="sm:col-span-3 lg:col-span-3 flex justify-start sm:justify-end">
              <button 
                onClick={navigateToContent} 
                className="px-4 py-2 bg-[#422FAF] hover:bg-[#3B27A1] text-white text-sm rounded-lg transition-all duration-300 flex items-center gap-1.5 hover:shadow-lg"
              >
                Continue
                <BsArrowRightShort className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced loading skeleton with wave animation
  const SkeletonLoader = () => (
    <div className="p-5 space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="animate-pulse border border-[#E5E7EB] p-5 rounded-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-20 w-20 rounded-lg bg-[#F3F4F6] flex-shrink-0"></div>
            <div className="flex flex-col flex-1 gap-3">
              <div className="h-5 w-3/4 bg-[#F3F4F6] rounded"></div>
              <div className="h-4 w-1/2 bg-[#F3F4F6] rounded"></div>
              <div className="h-3 w-full bg-[#F3F4F6] rounded"></div>
            </div>
            <div className="hidden sm:block w-1/4 space-y-3">
              <div className="h-4 w-1/2 bg-[#F3F4F6] rounded"></div>
              <div className="h-2 w-full bg-[#F3F4F6] rounded"></div>
              <div className="h-9 w-28 mt-4 bg-[#F3F4F6] rounded-lg float-right"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state screen with enhanced styling
  if (enrolledCourses?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] bg-[#F9FAFB] rounded-lg p-6">
        <div className="bg-[#EEF2FF] text-[#422FAF] rounded-full p-5 mb-6">
          <FaGraduationCap className="text-5xl" />
        </div>
        <h2 className="text-2xl md:text-3xl text-[#111827] font-bold text-center mb-3">
          Your Learning Journey Awaits
        </h2>
        <p className="text-[#4B5563] text-center max-w-md mb-6">
          Explore our catalog and enroll in courses to start learning new skills
        </p>
        <button 
          onClick={() => navigate("/catalog")} 
          className="px-6 py-3 bg-[#422FAF] hover:bg-[#3B27A1] text-white rounded-lg transition-all duration-300 flex items-center gap-2 hover:shadow-lg"
        >
          Browse Courses
          <BsArrowRightShort className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-6 sm:py-10">
      {/* Header Section with Enhanced Styling */}
      <div className="w-11/12 max-w-maxContent mx-auto">
        <div className="bg-gradient-to-r from-[#422FAF] to-[#5647C9] text-white rounded-xl p-8 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="bg-white/20 p-4 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FaGraduationCap className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left mb-3">
                My Learning Journey
              </h1>
              <p className="text-white/80 text-center sm:text-left max-w-2xl">
                Track your progress, pick up where you left off, and continue your path to mastery
              </p>
            </div>
            <div className="bg-white text-[#422FAF] font-semibold px-5 py-3 rounded-lg shadow-md flex items-center gap-2">
              <span className="text-xl">{enrolledCourses?.length || 0}</span>
              <span>{(enrolledCourses?.length || 0) === 1 ? 'Course' : 'Courses'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course List Section with Enhanced Styling */}
      <div className="w-11/12 max-w-maxContent mx-auto">
        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#E5E7EB]">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3">
              <div className="h-7 w-1 bg-[#422FAF] rounded-full"></div>
              <h2 className="text-xl font-semibold text-[#111827]">
                Enrolled Courses
              </h2>
            </div>
            <button 
              onClick={() => navigate("/")}
              className="text-sm text-[#422FAF] hover:text-[#3B27A1] font-medium flex items-center gap-1 transition-all duration-200 hover:gap-2"
            >
              Back to Home
              <BsArrowRightShort className="w-5 h-5" />
            </button>
          </div>
          
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <div>
              {enrolledCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats Card */}
        {enrolledCourses && enrolledCourses.length > 0 && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-md border border-[#E5E7EB]">
            <h3 className="font-semibold text-lg text-[#111827] mb-4">Your Learning Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Completed Courses */}
              <div className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB]">
                <span className="text-xs text-[#6B7280] uppercase font-medium">Completed</span>
                <div className="mt-1 font-bold text-2xl text-[#111827]">
                  {enrolledCourses.filter(course => course.progressPercentage >= 100).length}
                  <span className="ml-1 text-sm font-normal text-[#6B7280]">courses</span>
                </div>
              </div>
              
              {/* In Progress Courses */}
              <div className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB]">
                <span className="text-xs text-[#6B7280] uppercase font-medium">In Progress</span>
                <div className="mt-1 font-bold text-2xl text-[#111827]">
                  {enrolledCourses.filter(course => course.progressPercentage > 0 && course.progressPercentage < 100).length}
                  <span className="ml-1 text-sm font-normal text-[#6B7280]">courses</span>
                </div>
              </div>
              
              {/* Not Started Courses */}
              <div className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB]">
                <span className="text-xs text-[#6B7280] uppercase font-medium">Not Started</span>
                <div className="mt-1 font-bold text-2xl text-[#111827]">
                  {enrolledCourses.filter(course => !course.progressPercentage).length}
                  <span className="ml-1 text-sm font-normal text-[#6B7280]">courses</span>
                </div>
              </div>
              
              {/* Average Completion */}
              <div className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB]">
                <span className="text-xs text-[#6B7280] uppercase font-medium">Average Progress</span>
                <div className="mt-1 font-bold text-2xl text-[#111827]">
                  {Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progressPercentage || 0), 0) / enrolledCourses.length)}%
                  <span className="ml-1 text-sm font-normal text-[#6B7280]">completed</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}