import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiBook, FiUser } from "react-icons/fi";
import { FaStar, FaGraduationCap } from "react-icons/fa";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { motion } from "framer-motion";
import GetAvgRating from "../../../utils/avgRating";
import RatingStars from "../../common/RatingStars";
import Img from "./../../common/Img";

const Card = ({ course, Height, objectFit }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
  }, [course]);

  // Define category-based accent colors
  const categoryColors = {
    default: { primary: "#422faf", secondary: "#6366F1", bg: "rgba(66, 47, 175, 0.08)" },
    development: { primary: "#3B82F6", secondary: "#60A5FA", bg: "rgba(59, 130, 246, 0.08)" },
    design: { primary: "#EC4899", secondary: "#F472B6", bg: "rgba(236, 72, 153, 0.08)" },
    business: { primary: "#10B981", secondary: "#34D399", bg: "rgba(16, 185, 129, 0.08)" },
    marketing: { primary: "#F59E0B", secondary: "#FBBF24", bg: "rgba(245, 158, 11, 0.08)" },
    photography: { primary: "#8B5CF6", secondary: "#A78BFA", bg: "rgba(139, 92, 246, 0.08)" }
  };
  
  // Get category color or default
  const category = course?.category?.name?.toLowerCase() || "default";
  const colorScheme = categoryColors[category] || categoryColors.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 0.98, 
        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.3), 0 2px 8px ${colorScheme.primary}30` 
      }}
      className="h-full"
    >
      <Link to={`/courses/${course._id}`} className="block h-full">
        <div className="bg-gradient-to-br from-[#0c1220] via-[#111827] to-[#1a202c] rounded-2xl overflow-hidden p-3 text-white h-full flex flex-col border border-[#FFFFFF11]">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={course?.thumbnail}
              alt={course?.courseName}
              className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
            />
            
            {/* Category badge */}
            <div 
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ 
                background: `linear-gradient(45deg, ${colorScheme.primary}, ${colorScheme.secondary})`,
                boxShadow: `0 2px 8px ${colorScheme.primary}50`
              }}
            >
              {course?.category?.name || "Course"}
            </div>
            
            {/* Popular badge - conditionally shown */}
            {course?.studentsEnrolled?.length > 50 && (
              <div className="absolute top-3 right-3 bg-[#FF5722] px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <HiOutlineBadgeCheck className="text-white" />
                <span>Popular</span>
              </div>
            )}
            
            {/* Gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24"></div>
          </div>
          
          <div className="p-4 flex flex-col flex-grow">
            <div className="mb-2">
              <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">{course?.courseName}</h3>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-[#FFFFFF11] flex items-center justify-center">
                  <img
                    src={course?.instructor?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${course?.instructor?.firstName}`}
                    alt="Instructor"
                    className="h-5 w-5 rounded-full object-cover"
                  />
                </div>
                <p className="text-sm text-[#E0E0E0]">
                  {course?.instructor?.firstName} {course?.instructor?.lastName}
                </p>
              </div>
            </div>
            
            <div 
              className="flex items-center gap-2 mb-3 p-2 rounded-lg"
              style={{ backgroundColor: colorScheme.bg }}
            >
              <span className="text-[#FFFFFF] font-bold">{avgReviewCount.toFixed(1)}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-[#DBDBDB] text-sm">
                ({course?.ratingAndReviews?.length || 0})
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              {/* <div className="flex items-center gap-2 bg-[#FFFFFF11] rounded-lg p-2">
                <div className="bg-[#FFFFFF22] p-1 rounded">
                  <FiClock className="text-[#06D6A0]" />
                </div>
                <span className="text-[#E0E0E0]">{course?.duration || "8h 30m"}</span>
              </div> */}
              <div className="flex items-center gap-2 bg-[#FFFFFF11] rounded-lg p-2">
                <div className="bg-[#FFFFFF22] p-1 rounded">
                  <FiBook className="text-[#BB86FC]" />
                </div>
                <span className="text-[#E0E0E0]">{course?.courseContent?.length || 0} lectures</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FFFFFF11] rounded-lg p-2 col-span-2">
                <div className="bg-[#FFFFFF22] p-1 rounded">
                  <FiUser className="text-[#60A5FA]" />
                </div>
                <span className="text-[#E0E0E0]">{course?.studentsEnrolled?.length || 0} students enrolled</span>
              </div>
            </div>
            
            <div className="mt-auto flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-white">₹{course?.price}</p>
                {course?.originalPrice && course.originalPrice > course.price && (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400 line-through">₹{course?.originalPrice}</p>
                    <span className="text-xs bg-[#06D6A033] text-[#06D6A0] px-2 py-0.5 rounded-full font-medium">
                      {Math.round((1 - course.price / course.originalPrice) * 100)}% off
                    </span>
                  </div>
                )}
              </div>
              <motion.button
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-300"
                style={{ 
                  background: `linear-gradient(45deg, ${colorScheme.primary}, ${colorScheme.secondary})`,
                  boxShadow: `0 4px 10px ${colorScheme.primary}40` 
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Enroll Now</span>
                <FaGraduationCap className="text-lg" />
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Card;