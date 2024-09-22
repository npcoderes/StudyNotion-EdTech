import React, { useEffect, useState } from "react";

// import { FaRegStar, FaStar } from "react-icons/fa";
// import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";

import GetAvgRating from "../../../utils/avgRating";
import RatingStars from "../../common/RatingStars";
import Img from "./../../common/Img";

const Card = ({ course, Height }) => {
  // const avgReviewCount = GetAvgRating(course.ratingAndReviews)
  // console.log(course.ratingAndReviews)
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
  }, [course]);
  // console.log("count............", avgReviewCount)
  return (
    <>
      <div className="hover:scale-[0.97] transition-all duration-200 z-50">
        <Link to={`/courses/${course._id}`}>
          <div>
            <div className="rounded-lg">
              <Img
                src={course?.thumbnail}
                alt={"Course Thumbnail"}
                className={`${Height} w-full rounded-xl object-cover`}
              />
            </div>
            <div className="flex flex-col gap-2 py-3 px-1">
              <p className="text-xl text-richblack-5">{course?.courseName}</p>
              <p className="text-sm text-richblack-50">
                {course?.instructor?.firstName} {course?.instructor?.lastName}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-5">{avgReviewCount || 0}</span>
                {/* <ReactStars
                  count={5}
                  value={avgReviewCount || 0}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<FaRegStar />}
                  fullIcon={<FaStar />}
                /> */}
                <RatingStars Review_Count={avgReviewCount} />
                <span className="text-richblack-400">
                  {course?.ratingAndReviews?.length} Ratings
                </span>
              </div>
              <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Card;
