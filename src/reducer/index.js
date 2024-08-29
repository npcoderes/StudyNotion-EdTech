import { combineReducers } from "@reduxjs/toolkit";
import profileReducer from "../slices/profileSlice"
import authReducer from "../slices/authSlice";
import cartResucer from "../slices/cartSlice";
import courseResucer from "../slices/courseSlice";

import viewCourseSliceReducer from "../slices/viewCourseSlice";
const rootReducer=combineReducers({
      auth: authReducer,
      profile:profileReducer,
      cart: cartResucer,
      course:courseResucer,
      viewCourse:viewCourseSliceReducer,
    // Add other reducers here if needed-
})

export default rootReducer;