import React from "react";
import Login from "../../pages/Login";
import Signup from "../../pages/Signup";
import OpenRoute from "../Auth/OpenRoute";
import VerifyEmail from "../../pages/VerifyEmail";
import ForgotPass from "../../pages/ForgotPass";
import UpdatePassword from "../../pages/Update-pass";
import About from "../../pages/About";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../../pages/Home";
import { AnimatePresence } from "framer-motion";
import ContactUs from "../../pages/ContactUs";
import PageNotFound from "../../pages/PageNotFound";
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence>
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/login"
        element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <OpenRoute>
            <Signup />
          </OpenRoute>
        }
      />
      <Route
        path="/verify-email"
        element={
          <OpenRoute>
            {" "}
            <VerifyEmail />{" "}
          </OpenRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <OpenRoute>
            {" "}
            <ForgotPass />{" "}
          </OpenRoute>
        }
      />
      <Route
        path="/update-password/:id"
        element={
          <OpenRoute>
            {" "}
            <UpdatePassword />{" "}
          </OpenRoute>
        }
      />
     <Route
        path="/contact"
        element={
         
            
            <ContactUs/>
       
        }
      />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
