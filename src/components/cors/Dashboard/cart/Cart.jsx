import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartItems from './RenderCartItems'
import RenderTotalAmount from './RenderTotalAmount'

const Cart = () => {
  const { total, totalItems } = useSelector(state => state.cart)

  return (
    <div className="bg-richblack-900 rounded-lg py-10">
      <div className="w-11/12 max-w-[1000px] mx-auto">
        <h1 className="text-3xl font-medium text-richblack-5 mb-8">My Cart</h1>
        {total > 0 ? (
          <div className="flex flex-col-reverse md:flex-row gap-x-10 gap-y-6">
            <div className="flex-1">
              <RenderCartItems />
            </div>
            <div className="md:w-[30%] w-full">
              <RenderTotalAmount />
            </div>
          </div>
        ) : (
          <p className="text-center text-richblack-100 text-lg">Your cart is empty</p>
        )}
      </div>
    </div>
  )
}

export default Cart