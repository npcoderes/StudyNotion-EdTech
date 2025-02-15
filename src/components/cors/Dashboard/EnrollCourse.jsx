import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import Img from "./../../common/Img";
import toast from "react-hot-toast";
import { apiConnector } from "../../../services/apiconnector";
import CourseDetails from "../../../pages/CourseDetails";

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState(null);

  // fetch all users enrolled courses
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      console.log("res =============== ", res);
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.");
    }
  };
  // Add helper function at the top
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'INVALID', text: 'No expiry date' };
    console.log("expiryDate", expiryDate);
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    console.log("daysLeft", daysLeft);

    if (daysLeft < 0) return { status: 'EXPIRED', text: 'Expired' };
    if (daysLeft < 7) return { status: 'EXPIRING', text: `${daysLeft} days left` };
    return { status: 'ACTIVE', text: `Expires in ${daysLeft} days` };
  };
  useEffect(() => {
    getEnrolledCourses();
  }, []);
  // Add new components at top
  const CourseCard = ({ course, navigate }) => (
    <div className="group p-4 transition-all duration-200 hover:bg-richblack-700/50">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 items-start lg:items-center">
        {/* Course Info */}
        <div className="w-full lg:col-span-4 flex items-start gap-4">
          {/* Thumbnail */}
          <div 
            onClick={() => navigate(`/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}
            className="relative h-20 w-20 lg:h-16 lg:w-16 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
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
              className="font-semibold text-lg lg:text-base text-richblack-5 cursor-pointer hover:text-yellow-50 transition-colors duration-200 line-clamp-2"
            >
              {course.courseName}
            </h3>
            <p className="text-sm text-richblack-300 mt-1 line-clamp-1">
              {course.courseDescription}
            </p>
          </div>
        </div>
  
        {/* Stats Section */}
        <div className="w-full lg:col-span-8 grid grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 items-center">
          {/* Duration */}
          <div className="col-span-1 lg:col-span-3 text-richblack-50 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm whitespace-nowrap">{course.totalDuration || 'N/A'}</span>
          </div>
  
          {/* Progress Bar */}
          <div className="col-span-2 lg:col-span-6">
            <div className="flex justify-between text-xs text-richblack-50 mb-1">
              <span>Progress</span>
              <span className="font-medium">{course.progressPercentage || 0}%</span>
            </div>
            <ProgressBar
              completed={course.progressPercentage || 0}
              height="8px"
              isLabelVisible={false}
              bgColor="#FFD60A"
              baseBgColor="#2C333F"
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
  

const statusConfig = {
  EXPIRED: { bg: '#FEE2E2', text: '#EF4444', dot: '#DC2626' }, // Red shades
  EXPIRING: { bg: '#FEF3C7', text: '#F59E0B', dot: '#D97706' }, // Yellow shades
  ACTIVE: { bg: '#D1FAE5', text: '#10B981', dot: '#059669' },   // Green shades
  INVALID: { bg: '#E5E7EB', text: '#6B7280', dot: '#374151' },  // Gray shades
};

// Updated ExpiryStatus component with inline styles
const ExpiryStatus = ({ expireTime }) => {
  const { status, text } = getExpiryStatus(expireTime);
  const config = statusConfig[status] || statusConfig.INVALID;

  return (
    <div
      className="px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center justify-center w-fit"
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

  // Loading Skeleton
  const sklItem = () => {
    return (
      <div className="flex border border-richblack-700 p-4 rounded-lg ">
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
    );
  };

  // Return if data is null
  if (enrolledCourses?.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] bg-richblack-900 rounded-lg">
        <p className="text-3xl text-richblack-5 font-semibold">
          You have not enrolled in any course yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-richblack-900 min-h-screen py-4 sm:py-8">
    <div className="w-11/12 max-w-maxContent mx-auto space-y-4 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <h1 className="text-3xl sm:text-4xl font-boogaloo text-richblack-5">
          Enrolled Courses
        </h1>
        {enrolledCourses && (
          <div className="text-sm text-richblack-300">
            {enrolledCourses.length} {enrolledCourses.length === 1 ? 'Course' : 'Courses'} Enrolled
          </div>
        )}
      </div>

      <div className="bg-richblack-800 rounded-xl overflow-hidden shadow-lg">
        {!enrolledCourses ? (
          <sklItem />
        ) : (
          <div className="divide-y divide-richblack-700">
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
