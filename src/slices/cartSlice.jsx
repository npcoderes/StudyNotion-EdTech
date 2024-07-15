import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState ={
    cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
}

const cartSlice= createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
           const course=action.payload
           const itemIndex=state.cart.findIndex(x=>x.course._id===course._id)
          if(itemIndex > 0){
             toast.error("Item already in cart")
          }
          
            state.cart.push(course)
            state.total+=course.price
            state.totalItems+=1
            localStorage.setItem("cart", JSON.stringify(state.cart))
            localStorage.setItem("total", JSON.stringify(state.total))
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
            toast.success("Item added to cart")
          
        },
        removeItem: (state, action) => {
            const courseId = action.payload
            const index = state.cart.findIndex((item) => item._id === courseId)
      
            if (index >= 0) {
              // If the course is found in the cart, remove it
              state.totalItems--
              state.total -= state.cart[index].price
              state.cart.splice(index, 1)
              // Update to localstorage
              localStorage.setItem("cart", JSON.stringify(state.cart))
              localStorage.setItem("total", JSON.stringify(state.total))
              localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
              // show toast
              toast.success("Course removed from cart")
            }
        },
        resetItem: (state, action) => {
            state.cart = []
            state.total = 0
            state.totalItems = 0
            // Update to localstorage
            localStorage.removeItem("cart")
            localStorage.removeItem("total")
            localStorage.removeItem("totalItems")
          
        },
    }
})
export const {addItem,removeItem,resetItem}= cartSlice.actions

export default cartSlice.reducer;
