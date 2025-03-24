import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import Img from "./../../common/Img";
import toast from "react-hot-toast";

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState(null);

  // Light theme status configuration with hex values
  const statusConfig = {
    EXPIRED: { bg: '#FEE2E2', text: '#DC2626', dot: '#B91C1C' }, // Red shades
    EXPIRING: { bg: '#FEF3C7', text: '#D97706', dot: '#B45309' }, // Yellow shades
    ACTIVE: { bg: '#D1FAE5', text: '#059669', dot: '#047857' },   // Green shades
    INVALID: { bg: '#F3F4F6', text: '#4B5563', dot: '#374151' },  // Gray shades
  };

  // fetch all users enrolled courses
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.");
    }
  };
  
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'INVALID', text: 'No expiry date' };
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { status: 'EXPIRED', text: 'Expired' };
    if (daysLeft < 7) return { status: 'EXPIRING', text: `${daysLeft} days left` };
    return { status: 'ACTIVE', text: `Expires in ${daysLeft} days` };
  };
  
  useEffect(() => {
    getEnrolledCourses();
  }, []);
  
  const ExpiryStatus = ({ expireTime }) => {
    const { status, text } = getExpiryStatus(expireTime);
    const config = statusConfig[status] || statusConfig.INVALID;

    return (
      <div
        className="px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center justify-center w-fit shadow-sm"
        style={{ backgroundColor: config.bg, color: config.text }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full mr-1.5 hidden sm:inline-block"
          style={{ backgroundColor: config.dot }}
        ></span>
        {text}
      </div>
    );
  };

  const CourseCard = ({ course }) => (
    <div className="group p-4 transition-all duration-200 hover:bg-[#F9FAFB]">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 items-start lg:items-center">
        {/* Course Info */}
        <div className="w-full lg:col-span-4 flex items-start gap-4">
          {/* Thumbnail */}
          <div 
            onClick={() => navigate(`/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}
            className="relative h-20 w-20 lg:h-16 lg:w-16 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 border border-[#E5E7EB] shadow-sm"
          >
            <img
              src={course.thumbnail}
              alt={course.courseName}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
            />
          </div>
  
          {/* Course Details */}
          <div className="flex-1 min-w-0">
            <h3 
              onClick={() => navigate(`/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}
              className="font-semibold text-lg lg:text-base text-[#111827] cursor-pointer hover:text-[#4F46E5] transition-colors duration-200 line-clamp-2"
            >
              {course.courseName}
            </h3>
            <p className="text-sm text-[#6B7280] mt-1 line-clamp-1">
              {course.courseDescription}
            </p>
          </div>
        </div>
  
        {/* Stats Section */}
        <div className="w-full lg:col-span-8 grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 items-center">
          {/* Duration */}
          <div className="col-span-1 lg:col-span-3 text-[#4B5563] flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm whitespace-nowrap">{course.totalDuration || 'N/A'}</span>
          </div>
  
          {/* Progress Bar */}
          <div className="col-span-2 lg:col-span-6">
            <div className="flex justify-between text-xs text-[#6B7280] mb-1">
              <span>Progress</span>
              <span className="font-medium">{course.progressPercentage || 0}%</span>
            </div>
            <ProgressBar
              completed={course.progressPercentage || 0}
              height="8px"
              isLabelVisible={false}
              bgColor="#422FAF"
              baseBgColor="#E5E7EB"
              transitionDuration="0.3s"
              className="rounded-full overflow-hidden"
            />
          </div>
  
          {/* Expiry Status */}
          <div className="col-span-3 lg:col-span-3 flex justify-end lg:justify-center">
            <ExpiryStatus expireTime={course.expireTime} />
          </div>
        </div>
      </div>
    </div>
  );

  // Loading Skeleton for light theme
  const SkeletonLoader = () => (
    <div className="animate-pulse p-4">
      <div className="flex border border-[#E5E7EB] p-4 rounded-lg">
        <div className="flex flex-1 gap-4">
          <div className="h-14 w-14 rounded-lg bg-[#F3F4F6]"></div>
          <div className="flex flex-col w-2/5">
            <div className="h-4 w-1/2 bg-[#F3F4F6] rounded mb-2"></div>
            <div className="h-3 w-3/4 bg-[#F3F4F6] rounded"></div>
          </div>
        </div>
        <div className="flex flex-col w-2/5">
          <div className="h-3 w-1/5 bg-[#F3F4F6] rounded mb-2"></div>
          <div className="h-2 w-2/5 bg-[#F3F4F6] rounded"></div>
        </div>
      </div>
    </div>
  );

  // Return if data is null
  if (enrolledCourses?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)] bg-[#F9FAFB] rounded-lg">
        <FaGraduationCap className="text-[#9CA3AF] text-6xl mb-4" />
        <p className="text-2xl md:text-3xl text-[#111827] font-semibold text-center">
          You have not enrolled in any course yet.
        </p>
        <button 
          onClick={() => navigate("/catalog")} 
          className="mt-6 px-6 py-2 bg-[#422FAF] hover:bg-[#3B27A1] text-white rounded-md transition-colors duration-300"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-4 sm:py-8">
      {/* Header Section */}
      <div className="w-11/12 max-w-maxContent mx-auto">
        <div className="bg-gradient-to-r from-[#422FAF] to-[#5647C9] text-white rounded-xl p-6 sm:p-8 mb-8 shadow-md">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <FaGraduationCap className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left mb-2">
                My Learning
              </h1>
              <p className="text-white/80 text-center sm:text-left max-w-2xl">
                Track your progress, pick up where you left off, and continue your learning journey
              </p>
            </div>
            <div className="bg-white text-[#422FAF] font-semibold px-4 py-2 rounded-lg shadow-sm">
              {enrolledCourses?.length || 0} {(enrolledCourses?.length || 0) === 1 ? 'Course' : 'Courses'}
            </div>
          </div>
        </div>
      </div>

      {/* Course List Section */}
      <div className="w-11/12 max-w-maxContent mx-auto">
        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#E5E7EB]">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-[#111827]">
              Enrolled Courses
            </h2>
            <button 
              onClick={() => navigate("/")}
              className="text-sm text-[#422FAF] hover:text-[#3B27A1] font-medium"
            >
              Back to Home
            </button>
          </div>
          
          {!enrolledCourses ? (
            <SkeletonLoader />
          ) : (
            <div className="divide-y divide-[#E5E7EB]">
              {enrolledCourses.map(course => (
                <CourseCard key={course._id} course={course} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}