import React from "react";
import { useSelector } from "react-redux";
import { GiNinjaStar } from "react-icons/gi";
import ReactStars from "react-stars";
import {RiDeleteBin6Line} from "react-icons/ri"
import { useDispatch } from "react-redux";
import { removeItem } from "../../../../slices/cartSlice";
const RenderCartItems = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  return (
    <div>
      {cart.map((item, index) => (
        <div key={index}>
          <div>
            <img src={item?.thumbnail} alt={item?.courseName} />
            <div>
              <p>{item?.courseName}</p>
              <p>{item?.category?.name}</p>
              <div>
                <div>
                  <span>4.8</span>
                  <ReactStars
                    count={5}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emtpyIcon={<GiNinjaStar />}
                    fullIcon={<GiNinjaStar />}
                  />

                  <span>{item?.ratingAndReviews?.length} Ratings</span>
                </div>
              </div>
            </div>
          </div>
          <div>
              <button onClick={()=> dispatch(removeItem(item._id))}>
              <RiDeleteBin6Line/>
              <span>Remove</span>
              </button>
              <p>Rs {item?.price} </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderCartItems;
