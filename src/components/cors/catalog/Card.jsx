import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiBook, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import GetAvgRating from "../../../utils/avgRating";
import RatingStars from "../../common/RatingStars";
import Img from "./../../common/Img";

const Card = ({ course, Height, objectFit }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    console.log(course.ratingAndReviews);
    const count = GetAvgRating(course.ratingAndReviews);
    console.log(count);
    setAvgReviewCount(count);
    
  }, [course]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 0.96, boxShadow: "0 4px 20px rgba(0, 123, 255, 0.2)" }} // Updated shadow on hover
    >
      <Link to={`/courses/${course._id}`} className="block">
        <div className="bg-black rounded-2xl overflow-hidden border border-gray-300 p-3 text-white max-sm:py-7">
          <motion.div className="relative" whileHover={{ scale: 1 }}>
            <img
              src={course?.thumbnail}
              alt={course?.courseName}
              className={`w-[95%] mx-auto h-56 object-cover rounded-2xl`}
            />

            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <h3 className="text-xl font-bold text-white mb-1">{course?.courseName}</h3>
              <p className="text-sm text-gray-300">
                {course?.instructor?.firstName} {course?.instructor?.lastName}
              </p>
            </motion.div>
          </motion.div>
          <div className="p-4">
            <motion.div
              className="flex items-center gap-2 mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-[#fff] font-bold text-lg">{avgReviewCount.toFixed(1)}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-gray-500 text-sm">
                ({course?.ratingAndReviews?.length} reviews)
              </span>
            </motion.div>
            <motion.div
              className="grid grid-cols-2 gap-2 text-gray-600 text-sm mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center">
                <FiClock className="mr-2 text-[#fff]" />
                {course?.duration}
              </div>
              <div className="flex items-center">
                <FiBook className="mr-2 text-[#fff]" />
                {course?.courseContent.length} lectures
              </div>
              <div className="flex items-center">
                <FiUser className="mr-2 text-[#fff]" />
                {course?.studentsEnrolled?.length || 0} students
              </div>
            </motion.div>
            <motion.div
              className="flex justify-between items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-2xl font-bold text-white">₹{course?.price}</p>
              <motion.button
                className="bg-[#422faf] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#422faf] transition-colors duration-300 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Enroll Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Card;
