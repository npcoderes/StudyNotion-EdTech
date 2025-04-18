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
import PrivateRoute from "../Auth/PrivateRoute";
import Dashboard from "../../pages/Dashboard";
import MyProfile from "../cors/Dashboard/MyProfile";
import ProfileSet from "../cors/Dashboard/ProfileSet";
import EnrollCourse from "../cors/Dashboard/EnrollCourse";
import Cart from "../cors/Dashboard/cart/Cart";
import MyCourse from "../cors/Dashboard/MyCourse/MyCourse";
import AddCourses from "../cors/Dashboard/AddCourse/AddCourses";
import EditCourse from "../cors/Dashboard/EditCourse/EditCourse";
import Catelog from "../../pages/Catelog";
import CourseDetails from "../../pages/CourseDetails";
import ManageCategory from "../../pages/ManageCategory";
import ViewCourse from "../../pages/ViewCourse";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../../utils/constants";
import VideoDetails from "../cors/ViewCourse/VideoDetails"
import AdminReport from "../admin/AdminReport";
import AdminCourseReport from "../admin/AdminCourseReport";
import Instructor from "../cors/Dashboard/Instructor"
import AdminInstructoreManagement from "../admin/AdminInstructoreManagement";
import InstructorAnalytics from "../admin/InstructorAnalytics";
import PrivacyPolicy from "../../pages/PrivacyPolicy";
import InstructorCourses from "../cors/Doubt/InstructorCourses";
import TakeExam from "../cors/ViewCourse/TakeExam";
import ExamResults from "../cors/ViewCourse/ExamResults";
import CertificateView from "../cors/Certificate/CertificateView";
import MyCertificates from "../cors/Dashboard/Certificate/MyCertificates";
import AdminReviewsPage from "../../pages/AdminReviewsPage";

const AnimatedRoutes = () => {
  const { user } = useSelector((state) => state.profile);

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
        <Route path="/contact" element={<ContactUs />} />

        <Route
          path=""
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-certificates" element={
            <PrivateRoute>
              <MyCertificates />
            </PrivateRoute>
          } />

// Public certificate verification route
          <Route path="certificate/verify/:certificateId" element={<CertificateView />} />

// Protected certificate view route
          <Route path="certificate/view/:certificateId" element={
            <PrivateRoute>
              <CertificateView />
            </PrivateRoute>
          } />


          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="/dashboard/settings" element={<ProfileSet />} />
          <Route
            path="/dashboard/enrolled-courses"
            element={<EnrollCourse />}
          />
          <Route path="/dashboard/cart" element={<Cart />} />
          <Route path="/dashboard/my-courses" element={<MyCourse />} />
          <Route path="/dashboard/add-course" element={<AddCourses />} />
          <Route
            path="/dashboard/edit-course/:courseId"
            element={<EditCourse />}
          />
          <Route path="dashboard/instructor" element={<Instructor />} />
          <Route path="/manage-category" element={<ManageCategory />} />
          <Route path="/doubt-list" element={<InstructorCourses />} />
          {user?.accountType == ACCOUNT_TYPE.ADMIN && (
            <>
              <Route path="/admin/report" element={<AdminReport />} />
              <Route path="/admin/courses" element={<AdminCourseReport />} />
              <Route path="/admin/users" element={<AdminInstructoreManagement />} />
              <Route path="/admin/analytics" element={<InstructorAnalytics />} />
              <Route path="/admin/reviews" element={<AdminReviewsPage />} />


            </>

          )}
        </Route>

        {/* For the watching course lectures */}
        <Route path=""
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType == ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
              <Route path="/view-course/:courseId/take-exam" element={<TakeExam />} />;
              <Route path="view-course/:courseId/exam-results" element={
                <PrivateRoute>
                  <ExamResults />
                </PrivateRoute>
              } />
            </>
          )}
        </Route>

        <Route path="/catalog/:catalogName" element={

          <Catelog />

        }></Route>
        <Route
          path="/courses/:courseId"
          element={
            <PrivateRoute>
              <CourseDetails />
            </PrivateRoute>
          }
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
