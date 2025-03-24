import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiShoppingCart } from 'react-icons/fi'
import RenderCartItems from './RenderCartItems'
import RenderTotalAmount from './RenderTotalAmount'

const Cart = () => {
  const { total, totalItems } = useSelector(state => state.cart)
  const navigate = useNavigate()

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-6 sm:py-10">
      <div className="w-11/12 max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2 sm:mb-0 flex items-center">
            <FiShoppingCart className="mr-2 text-[#422FAF]" />
            My Cart 
            <span className="ml-3 text-sm bg-[#422FAF] text-white py-0.5 px-2 rounded-full">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </h1>
          <button 
            onClick={() => navigate('/catalog')} 
            className="text-sm text-[#422FAF] hover:text-[#3B27A1] font-medium flex items-center"
          >
            Continue Shopping
          </button>
        </div>
        
        {/* Cart Content */}
        {total > 0 ? (
          <div className="flex flex-col-reverse md:flex-row gap-x-10 gap-y-6">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="border-b border-[#E5E7EB] p-4 sm:p-6">
                  <h2 className="text-lg font-semibold text-[#111827]">Cart Items</h2>
                </div>
                <RenderCartItems />
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="md:w-[35%] w-full">
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="border-b border-[#E5E7EB] p-4 sm:p-6">
                  <h2 className="text-lg font-semibold text-[#111827]">Order Summary</h2>
                </div>
                <RenderTotalAmount />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 sm:p-12 text-center shadow-sm">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-[#F3F4F6] p-4 rounded-full">
                <FiShoppingCart className="w-12 h-12 text-[#9CA3AF]" />
              </div>
              <h2 className="text-xl font-semibold text-[#111827]">Your cart is empty</h2>
              <p className="text-[#6B7280] max-w-md mx-auto">
                Looks like you haven't added any courses to your cart yet.
              </p>
              <button
                onClick={() => navigate('/catalog/Web-Dev')}
                className="mt-4 px-6 py-2.5 bg-[#422FAF] hover:bg-[#3B27A1] text-white rounded-lg transition-colors duration-300"
              >
                Browse Courses
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart