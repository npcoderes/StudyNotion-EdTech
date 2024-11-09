import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn';
import { useNavigate } from 'react-router-dom';
import { buyCourse } from '../../../../services/operations/studentFeaturesAPI';
const RenderTotalAmount = () => {

    const {total, cart} = useSelector((state) => state.cart);
   const {token}=useSelector(state=>state.auth)
   const navigate=useNavigate()
   const dispatch=useDispatch()
   const {user}=useSelector(state=>state.profile)
    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id);
        console.log("printing courses id  ",courses)
        // for(const courseid of courses)
        // {
        //   console.log("for   ",courseid)
        // }
        if (token) {
          const coursesId = [courses]
          // console.log("printing courses id ......... ",courses)
          buyCourse(token, coursesId, user, navigate, dispatch)
          return
        }

        //TODO: API integrate -> payment gateway tak leke jaegi
    }
  return (
    <div className="bg-richblack-800 p-6 rounded-lg">
        <p className="text-richblack-200 text-sm font-medium mb-1">Total:</p>
        <p className="text-3xl font-semibold text-yellow-50 mb-6">₹ {total}</p>

        <IconBtn 
            text="Buy Now"
            onclick={handleBuyCourse}
            customClasses="w-full justify-center text-lg font-semibold"
        />
    </div>
  )
}

export default RenderTotalAmount
