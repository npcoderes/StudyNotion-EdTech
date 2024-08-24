import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartItems from './RenderCartItems'
import RenderTotalAmount from './RenderTotalAmount'

const Cart = () => {
  const {totalItems,total}=useSelector(state=>state.cart)


  return (
    <div>
        <h1>My Cart</h1>
        {
          
          total  ? (<div>
            <h1>Total: {totalItems} courses in your cart</h1>
            <RenderCartItems />
            <RenderTotalAmount />
          </div>) : (<h1>Your cart is empty</h1>)
        }


    </div>
  )
}

export default Cart