import { combineReducers } from "@reduxjs/toolkit";
import profileReducer from "../slices/profileSlice"
import authReducer from "../slices/authSlice";
import cartResucer from "../slices/cartSlice";

const rootReducer=combineReducers({
      auth: authReducer,
      profile:profileReducer,
      cart: cartResucer,
    // Add other reducers here if needed-
})

export default rootReducer;