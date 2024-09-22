import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { GiNinjaStar } from "react-icons/gi";
import ReactStars from "react-stars";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeItem } from "../../../../slices/cartSlice";

const RenderCartItems = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-6">
      {cart.map((item, index) => (
        <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-richblack-700 pb-6">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-3/4">
            <img src={item?.thumbnail} alt={item?.courseName} className="w-full md:w-[220px] h-[148px] rounded-lg object-cover" />
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold text-richblack-5">{item?.courseName}</p>
              <p className="text-sm text-richblack-300">{item?.category?.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-50"></span>
                <ReactStars
                  count={5}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<GiNinjaStar />}
                  fullIcon={<GiNinjaStar />}
                />
                <span className="text-richblack-400 text-sm">
                  {item?.ratingAndReviews?.length} Ratings
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
            <button
              onClick={() => dispatch(removeItem(item._id))}
              className="flex items-center gap-2 text-pink-200 text-sm font-medium"
            >
              <RiDeleteBin6Line />
              <span>Remove</span>
            </button>
            <p className="text-xl font-semibold text-yellow-50">₹ {item?.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderCartItems;
