import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn';
import { useNavigate } from 'react-router-dom';
import { buyCourse } from '../../../../services/operations/studentFeaturesAPI';

const RenderTotalAmount = () => {
    const { total, cart } = useSelector((state) => state.cart);
    const { token } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.profile);

    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id);
        console.log("printing courses id  ", courses);

        if (token) {
            const coursesId = [courses];
            buyCourse(token, coursesId, user, navigate, dispatch);
            return;
        }
    }

    return (
        <div className="p-6">
            {/* Order Summary Details */}
            <div className="mb-6 space-y-3">
                <div className="flex justify-between text-[#4B5563] text-sm">
                    <p>Original Price</p>
                    <p>₹ {total.toLocaleString('en-IN')}</p>
                </div>
                
                {/* This can be uncommented and adjusted if discounts are needed */}
                {/* <div className="flex justify-between text-[#059669] text-sm">
                    <p>Discounts</p>
                    <p>- ₹ {0}</p>
                </div> */}
                
                <div className="border-t border-[#E5E7EB] pt-3 mt-3"></div>
                
                <div className="flex justify-between font-semibold text-[#111827]">
                    <p>Total</p>
                    <p>₹ {total.toLocaleString('en-IN')}</p>
                </div>
            </div>

            {/* Secure Checkout Label */}
            <div className="flex items-center justify-center gap-2 mb-4 bg-[#F3F4F6] rounded-md p-2">
                <svg className="w-4 h-4 text-[#4B5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-[#4B5563]">Secure Checkout</span>
            </div>

            {/* Buy Now Button */}
            <IconBtn 
                text="Buy Now"
                onclick={handleBuyCourse}
                className="w-full justify-center text-lg font-semibold bg-[#422FAF] hover:bg-[#3B27A1] text-white py-3"
            />

            {/* Tax Note */}
            <p className="text-[#6B7280] text-xs text-center mt-3">
                Taxes are included in the total amount
            </p>
        </div>
    )
}

export default RenderTotalAmount