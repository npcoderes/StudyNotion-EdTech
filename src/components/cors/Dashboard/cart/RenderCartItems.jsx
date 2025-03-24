import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { GiNinjaStar } from "react-icons/gi";
import ReactStars from "react-stars";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeItem } from "../../../../slices/cartSlice";
import GetAvgRating from "../../../../utils/avgRating";

const RenderCartItems = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col divide-y divide-[#E5E7EB]">
      {cart.map((item, index) => (
        <div 
          key={index} 
          className="p-4 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center"
        >
          {/* Course Image and Info */}
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-3/4">
            {/* Course Thumbnail */}
            <div className="w-full md:w-[180px] h-[120px] rounded-lg overflow-hidden border border-[#E5E7EB] shadow-sm flex-shrink-0">
              <img 
                src={item?.thumbnail} 
                alt={item?.courseName} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
              />
            </div>
            
            {/* Course Details */}
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-[#111827] line-clamp-2">
                {item?.courseName}
              </h3>
              
              <p className="text-sm text-[#6B7280]">
                {item?.category?.name}
              </p>
              
              {/* Ratings */}
              <div className="flex items-center gap-2 mt-1">
                <ReactStars
                  count={5}
                  size={20}
                  edit={false}
                  color2="#422FAF"
                  color1="#D1D5DB"
                  value={GetAvgRating(item?.ratingAndReviews)}
                />
                <span className="text-[#6B7280] text-sm">
                  {item?.ratingAndReviews?.length || 0} Ratings
                </span>
              </div>
            </div>
          </div>
          
          {/* Price and Actions */}
          <div className="flex flex-col items-end gap-3 mt-4 md:mt-0 w-full md:w-1/4">
            {/* Remove Button */}
            <button
              onClick={() => dispatch(removeItem(item._id))}
              className="flex items-center gap-1.5 text-[#DC2626] hover:text-[#B91C1C] text-sm font-medium transition-colors duration-200"
            >
              <RiDeleteBin6Line className="text-base" />
              <span>Remove</span>
            </button>
            
            {/* Price */}
            <p className="text-xl font-semibold text-[#422FAF]">
              ₹ {item?.price.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderCartItems;