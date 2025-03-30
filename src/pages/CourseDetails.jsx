import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import toast from "react-hot-toast";
import GetAvgRating from "../utils/avgRating";
import RatingStars from "../components/common/RatingStars";
import Img from "../components/common/Img";
import { RxInfoCircled } from "react-icons/rx";
import { MdLanguage } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addItem, removeItem } from "../slices/cartSlice";
import { FaClockRotateLeft } from "react-icons/fa6";
import { GrCertificate } from "react-icons/gr";
import { FaMobile } from "react-icons/fa";
import { FaRegCaretSquareRight } from "react-icons/fa";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import { logout } from "../services/operations/authAPI";

import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  LibraryBooks as LibraryBooksIcon,
  OndemandVideo as VideoIcon,
  AccessTime as TimeIcon,
  Description as DescriptionIcon,
  PlayCircleOutline as PlayIcon
} from '@mui/icons-material';
import {
  Card,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Chip,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ReviewSlider from "../components/common/ReviewSlider";

const CourseDetails = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { token } = useSelector(state => state.auth);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [isInCart, setIsInCart] = useState(false);
  const { user } = useSelector(state => state.profile)
  const dispatch = useDispatch();
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [er, setEr] = useState(false);

  const handleRemoveFromCart = () => {
    dispatch(removeItem(courseDetails?.courseDetails?._id));
    setIsInCart(false);
  };
  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const result = await getFullDetailsOfCourse(courseId, token);
        if (result) {
          setCourseDetails(result);
          console.log("courseDetails?.courseDetails?.ratingAndReviews............", result?.courseDetails?.ratingAndReviews);
          const count = GetAvgRating(result?.courseDetails?.ratingAndReviews);
          setAvgReviewCount(count);
          console.log("result............", result);
          if (result.success === false) {
            setEr(true);
            toast.error("Something went wrong please login again ")
            dispatch(logout(navigate))
          }
        }
      } catch (error) {

        // console.error("Error fetching course details:", error);

        // Handle error (e.g., show error message to user)
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, token]);
  // useEffect(() => {

  //   const count = GetAvgRating(courseDetails?.courseDetails?.ratingAndReviews);
  //   setAvgReviewCount(count);
  // }, [courseId, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!courseDetails) {
    return <div>No course details available.</div>;
  }

  let tags = [];
  try {
    if (Array.isArray(courseDetails?.courseDetails?.tag)) {
      tags = courseDetails.courseDetails.tag;
    } else if (typeof courseDetails?.courseDetails?.tag === 'string') {
      if (courseDetails.courseDetails.tag.startsWith('[')) {
        tags = JSON.parse(courseDetails.courseDetails.tag);
      } else {
        tags = [courseDetails.courseDetails.tag];
      }
    }
  } catch (error) {
    console.warn("Error parsing tags:", error);
    if (courseDetails?.courseDetails?.tag) {
      tags = [courseDetails.courseDetails.tag];
    }
  }

  let instructions = [];
  try {
    if (Array.isArray(courseDetails?.courseDetails?.instructions)) {
      instructions = courseDetails.courseDetails.instructions;
    } else if (typeof courseDetails?.courseDetails?.instructions === 'string') {
      if (courseDetails.courseDetails.instructions.startsWith('[')) {
        instructions = JSON.parse(courseDetails.courseDetails.instructions);
      } else {
        instructions = [courseDetails.courseDetails.instructions];
      }
    }
  } catch (error) {
    console.warn("Error parsing instructions:", error);
    if (courseDetails?.courseDetails?.instructions) {
      instructions = [courseDetails.courseDetails.instructions];
    }
  }

  // Buy Course handler
  const handleBuyCourse = () => {
    if (token) {
      const coursesId = [courseId]
      console.log("coursesId", coursesId)
      buyCourse(token, coursesId, user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  // Add to cart Course handler
  const handleAddToCart = () => {

    if (token) {
      dispatch(addItem(courseDetails?.courseDetails))
      setIsInCart(true)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }





  return (
    <>
      {/* section 1  */}
      <div className="bg-gradient-to-br from-[#0c1220] via-[#111827] to-[#1a202c] min-h-[300px] w-full mt-20">
        <section className="w-11/12 max-w-maxContent mx-auto flex flex-col sm:flex-row gap-8 py-12 relative">
          <div className="min-h-[100px] w-full">
            {/* Header part */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center">
                <span className="bg-[#422FAF] w-1 h-5 rounded mr-2"></span>
                <p className="text-[#BB86FC] text-xs tracking-widest uppercase font-medium flex items-center">
                  <span className="mr-2">Course</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-1">
                    <path d="M9 18L15 12L9 6" stroke="#BB86FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="mr-2">Learning</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-1">
                    <path d="M9 18L15 12L9 6" stroke="#BB86FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="bg-[#422FAF33] px-2 py-1 rounded text-[#BB86FC]">
                    {courseDetails?.courseDetails?.category?.name}
                  </span>
                </p>
              </div>

              <h1 className="text-[#E0E0E0] text-3xl sm:text-4xl font-bold tracking-wide leading-tight">
                {courseDetails?.courseDetails?.courseName}
              </h1>

              <p className="text-[#E0E0E0] text-sm sm:text-base w-full sm:w-[630px] mt-1 line-clamp-2 tracking-wide font-inter leading-relaxed bg-[#FFFFFF08] p-3 rounded-lg border border-[#FFFFFF11]">
                {courseDetails?.courseDetails?.courseDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-2 bg-[#FFFFFF11] px-3 py-1.5 rounded-full">
                  <span className="text-[#BB86FC] font-bold">{avgReviewCount}</span>
                  <RatingStars Review_Count={avgReviewCount} />
                  <span className="text-[#E0E0E0] text-sm">
                    ({courseDetails?.courseDetails?.ratingAndReviews?.length})
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-[#FFFFFF11] px-3 py-1.5 rounded-full">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#06D6A0" />
                  </svg>
                  <span className="text-[#E0E0E0] text-sm">
                    {courseDetails?.courseDetails?.studentsEnrolled?.length} students enrolled
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <div className="h-10 w-10 rounded-full bg-[#FFFFFF11] flex items-center justify-center">
                  <img
                    src={courseDetails?.courseDetails?.instructor?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${courseDetails?.courseDetails?.instructor?.firstName}`}
                    alt="Instructor"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </div>
                <p className="text-[#E0E0E0] text-sm">
                  Created by <span className="text-[#BB86FC] font-medium">{courseDetails?.courseDetails?.instructor?.firstName} {courseDetails?.courseDetails?.instructor?.lastName}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-2 bg-[#FFFFFF11] px-3 py-1.5 rounded-lg">
                  <RxInfoCircled className="text-[#BB86FC] text-lg" />
                  <p className="text-[#E0E0E0] text-sm">
                    {new Date(courseDetails?.courseDetails?.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#FFFFFF11] px-3 py-1.5 rounded-lg">
                  <MdLanguage className="text-[#BB86FC] text-lg" />
                  <p className="text-[#E0E0E0] text-sm">English</p>
                </div>

                <div className="flex items-center gap-2 bg-[#FFFFFF11] px-3 py-1.5 rounded-lg">
                  <ScheduleIcon className="text-[#BB86FC] text-lg" />
                  <p className="text-[#E0E0E0] text-sm">Course Expires 1 Year After Purchase</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card part */}
          <div className="flex flex-col gap-4 p-5 bg-gradient-to-br from-[#1F1F1F] to-[#2A2A2A] rounded-xl sm:max-w-[400px] w-full lg:absolute right-0 border border-[#FFFFFF11] shadow-xl shadow-[#00000060]">
            <div className="relative">
              <Img
                src={courseDetails?.courseDetails?.thumbnail}
                className="h-[200px] w-full object-cover rounded-lg shadow-md shadow-[#00000080]"
              />
              <div className="absolute top-2 right-2 bg-[#FF5722] text-white px-2 py-1 rounded-full text-xs font-bold">
                Featured
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-[#E0E0E0] text-2xl font-bold">
                Rs. {courseDetails?.courseDetails?.price}
              </p>
              {/* <div className="bg-[#FFFFFF11] px-3 py-1 rounded-full">
                <p className="text-[#06D6A0] text-xs font-medium">70% off</p>
              </div> */}
            </div>

            <div>
              {/* Buttons */}
              {user.accountType === "Student" && (
                <div className="flex gap-3 flex-col">
                  {isInCart ? (
                    <button
                      onClick={handleRemoveFromCart}
                      className="bg-gradient-to-r from-[#FFFFFF99] to-[#FFFFFFAA] text-[#121212] text-center text-[14px] px-6 py-3.5 rounded-lg font-bold hover:opacity-90 transition-all w-full duration-200 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 13H5V11H19V13Z" fill="#121212" />
                      </svg>
                      Remove from Cart
                    </button>
                  ) : (
                    <button
                      className="bg-gradient-to-r from-[#FFFFFF] to-[#EFEFEF] text-[#121212] text-center text-[14px] px-6 py-3.5 rounded-lg font-bold hover:opacity-90 transition-all w-full duration-200 flex items-center justify-center gap-2 shadow-lg"
                      onClick={handleAddToCart}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 18C15.89 18 15 18.89 15 20C15 21.11 15.89 22 17 22C18.11 22 19 21.11 19 20C19 18.89 18.11 18 17 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.11 5.89 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75C7.17 14.7 7.18 14.66 7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.5C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM7 18C5.89 18 5 18.89 5 20C5 21.11 5.89 22 7 22C8.11 22 9 21.11 9 20C9 18.89 8.11 18 7 18Z" fill="#121212" />
                      </svg>
                      Add To Cart
                    </button>
                  )}
                  <button
                    onClick={handleBuyCourse}
                    className="bg-gradient-to-r from-[#422FAF] to-[#6366F1] text-[#FFFFFF] text-center text-[14px] px-6 py-3.5 rounded-lg font-bold hover:opacity-90 transition-all w-full duration-200 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM9.5 16.5L16.5 12L9.5 7.5V16.5Z" fill="white" />
                    </svg>
                    Buy Now
                  </button>
                </div>
              )}
              <div className="flex items-center justify-center gap-2 mt-4 bg-[#FFFFFF11] py-2 rounded-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM19 11C19 15.52 16.02 19.69 12 20.93C7.98 19.69 5 15.52 5 11V6.3L12 3.19L19 6.3V11ZM7.41 11.59L6 13L10 17L18 9L16.59 7.58L10 14.17L7.41 11.59Z" fill="#06D6A0" />
                </svg>
                <p className="text-[#DBDDEA] font-medium text-xs">
                  30-Day Money-Back Guarantee
                </p>
              </div>

              {/* Information data */}
              <div className="mt-6 bg-[#FFFFFF08] p-4 rounded-lg border border-[#FFFFFF11]">
                <h4 className="text-[#E0E0E0] font-semibold mb-3 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 5C19.89 4.65 18.67 4.5 17.5 4.5C15.55 4.5 13.45 4.9 12 6C10.55 4.9 8.45 4.5 6.5 4.5C4.55 4.5 2.45 4.9 1 6V20.65C1 20.9 1.25 21.15 1.5 21.15C1.6 21.15 1.65 21.1 1.75 21.1C3.1 20.45 5.05 20 6.5 20C8.45 20 10.55 20.4 12 21.5C13.35 20.65 15.8 20 17.5 20C19.15 20 20.85 20.3 22.25 21.05C22.35 21.1 22.4 21.1 22.5 21.1C22.75 21.1 23 20.85 23 20.6V6C22.4 5.55 21.75 5.25 21 5ZM21 18.5C19.9 18.15 18.7 18 17.5 18C15.8 18 13.35 18.65 12 19.5V8C13.35 7.15 15.8 6.5 17.5 6.5C18.7 6.5 19.9 6.65 21 7V18.5Z" fill="#BB86FC" />
                    <path d="M17.5 10.5C18.38 10.5 19.23 10.59 20 10.76V9.24C19.21 9.09 18.36 9 17.5 9C15.8 9 14.26 9.29 13 9.83V11.49C14.13 10.85 15.7 10.5 17.5 10.5Z" fill="#BB86FC" />
                    <path d="M13 12.49V14.15C14.13 13.51 15.7 13.16 17.5 13.16C18.38 13.16 19.23 13.25 20 13.41V11.9C19.21 11.75 18.36 11.66 17.5 11.66C15.8 11.66 14.26 11.96 13 12.49Z" fill="#BB86FC" />
                    <path d="M17.5 14.33C15.8 14.33 14.26 14.63 13 15.16V16.82C14.13 16.18 15.7 15.83 17.5 15.83C18.38 15.83 19.23 15.92 20 16.08V14.57C19.21 14.42 18.36 14.33 17.5 14.33Z" fill="#BB86FC" />
                  </svg>
                  This course includes:
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="bg-[#06D6A033] p-1.5 rounded-lg">
                      <FaClockRotateLeft className="text-[#06D6A0] text-sm" />
                    </div>
                    <span className="text-[#E0E0E0] text-sm">8 hours on-demand video</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-[#06D6A033] p-1.5 rounded-lg">
                      <FaRegCaretSquareRight className="text-[#06D6A0] text-sm" />
                    </div>
                    <span className="text-[#E0E0E0] text-sm">Full Lifetime access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-[#06D6A033] p-1.5 rounded-lg">
                      <FaMobile className="text-[#06D6A0] text-sm" />
                    </div>
                    <span className="text-[#E0E0E0] text-sm">Access on Mobile and TV</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-[#06D6A033] p-1.5 rounded-lg">
                      <GrCertificate className="text-[#06D6A0] text-sm" />
                    </div>
                    <span className="text-[#E0E0E0] text-sm">Certificate of completion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* End of card part */}
        </section>
      </div>
      {/* section 2  */}
      <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', mt: 10, px: 2 }}>
        {/* What you'll learn section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{
            width: { xs: '100%', md: '66%' },
            mb: 4,
            p: 3,
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
            borderRadius: '16px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            overflow: 'hidden'
          }}>
            <Box sx={{
              position: 'relative',
              mb: 2,
              pb: 2,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                width: '80px',
                background: 'linear-gradient(90deg, #422FAF 0%, #6366F1 100%)',
                borderRadius: '8px'
              }
            }}>
              <Typography variant="h4" fontWeight="700" color="#111827" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{
                  color: 'white',
                  bgcolor: '#422FAF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  mr: 1.5,
                  boxShadow: '0 4px 12px rgba(66, 47, 175, 0.3)'
                }}>
                  <SchoolIcon fontSize="small" />
                </Box>
                What you'll learn
              </Typography>
            </Box>

            <List sx={{ py: 1 }}>
              {tags.map((item, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon sx={{
                      color: '#10B981',
                      filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.2))'
                    }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: '#4B5563',
                        fontWeight: 500
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </motion.div>

        {/* Course Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card sx={{
            width: { xs: '100%', md: '66%' },
            mb: 4,
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
            borderRadius: '16px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            overflow: 'hidden'
          }}>
            <Box sx={{
              p: 3,
              bgcolor: '#F9FAFB',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <Box sx={{
                bgcolor: '#EEF2FF',
                borderRadius: '12px',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MenuBookIcon sx={{ color: '#422FAF' }} />
              </Box>
              <Typography variant="h5" fontWeight="700" color="#111827">
                Course Content
              </Typography>
            </Box>

            {courseDetails?.courseDetails?.courseContent?.map((item, index) => (
              <Accordion
                key={index}
                defaultExpanded={index === 0}
                sx={{
                  '&.MuiAccordion-root': {
                    borderRadius: 0,
                    boxShadow: 'none',
                    '&:before': { display: 'none' },
                    borderBottom: '1px solid #E5E7EB'
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon sx={{
                      color: '#422FAF',
                      bgcolor: '#EEF2FF',
                      borderRadius: '50%',
                      p: 0.5
                    }} />
                  }
                  sx={{
                    bgcolor: '#F9FAFB',
                    '&:hover': { bgcolor: '#F3F4F6' },
                    '& .MuiAccordionSummary-content': {
                      margin: '12px 0'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        bgcolor: '#EEF2FF',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 0.75
                      }}>
                        <LibraryBooksIcon sx={{ color: '#422FAF', fontSize: '1.2rem' }} />
                      </Box>
                      <Typography variant="subtitle1" fontWeight="600" color="#111827">
                        {item.sectionName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Chip
                        size="small"
                        icon={<VideoIcon sx={{ fontSize: '0.9rem !important', color: '#422FAF !important' }} />}
                        label={`${item.subSection.length} lectures`}
                        sx={{
                          bgcolor: '#EEF2FF',
                          color: '#422FAF',
                          fontWeight: 500,
                          '& .MuiChip-icon': { color: '#422FAF' }
                        }}
                      />
                      <Chip
                        size="small"
                        icon={<TimeIcon sx={{ fontSize: '0.9rem !important', color: '#4B5563 !important' }} />}
                        label={courseDetails?.totalDuration}
                        sx={{
                          bgcolor: '#F3F4F6',
                          color: '#4B5563',
                          fontWeight: 500,
                          '& .MuiChip-icon': { color: '#4B5563' }
                        }}
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: '#FFFFFF', p: 0 }}>
                  {item.subSection.map((data, subIndex) => (
                    <Accordion
                      key={subIndex}
                      sx={{
                        '&.MuiAccordion-root': {
                          boxShadow: 'none',
                          '&:before': { display: 'none' },
                          borderBottom: subIndex !== item.subSection.length - 1 ? '1px solid #E5E7EB' : 'none'
                        }
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: '#6B7280' }} />}
                        sx={{
                          '&:hover': { bgcolor: '#F9FAFB' },
                          pl: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Box sx={{
                            bgcolor: '#EEF2FF',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5
                          }}>
                            <PlayIcon sx={{ color: '#422FAF', fontSize: '1rem' }} />
                          </Box>
                          <Typography sx={{ color: '#111827', fontWeight: 500 }}>
                            {data.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', mr: 2 }}>
                            <TimeIcon sx={{ mr: 0.5, fontSize: '0.9rem', color: '#6B7280' }} />
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ bgcolor: '#F9FAFB', p: 3, borderTop: '1px dashed #E5E7EB' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <Box sx={{
                            bgcolor: '#E5E7EB',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            mt: 0.5
                          }}>
                            <DescriptionIcon sx={{ color: '#6B7280', fontSize: '1rem' }} />
                          </Box>
                          <Typography sx={{ color: '#4B5563', lineHeight: 1.6, fontSize: '0.9rem' }}>
                            {data?.description}
                          </Typography>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </Card>
        </motion.div>

        {/* Author Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card sx={{
            width: { xs: '100%', md: '66%' },
            mb: 8,
            p: 0,
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
            borderRadius: '16px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            overflow: 'hidden'
          }}>
            <Box sx={{
              p: 3,
              bgcolor: '#F9FAFB',
              borderBottom: '1px solid #E5E7EB',
              position: 'relative'
            }}>
              <Typography variant="h5" fontWeight="700" color="#111827" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{
                  color: 'white',
                  bgcolor: '#422FAF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  mr: 1.5,
                  boxShadow: '0 4px 12px rgba(66, 47, 175, 0.3)'
                }}>
                  <PersonIcon fontSize="small" />
                </Box>
                Instructor
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
                p: 2,
                bgcolor: '#F9FAFB',
                borderRadius: '12px'
              }}>
                <Avatar
                  src={courseDetails?.courseDetails?.instructor?.image}
                  sx={{
                    width: 72,
                    height: 72,
                    mr: 2,
                    border: '3px solid white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                  }}
                />
                <Box>
                  <Typography variant="h6" sx={{ color: '#111827', fontWeight: 600, mb: 0.5 }}>
                    {courseDetails?.courseDetails?.instructor?.firstName}{" "}
                    {courseDetails?.courseDetails?.instructor?.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <VerifiedIcon sx={{ color: '#10B981', fontSize: '1rem' }} />
                    Verified Instructor
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{
                my: 3,
                '&::before, &::after': {
                  borderColor: '#E5E7EB',
                }
              }}>
                <Chip
                  label="Instructions"
                  sx={{
                    bgcolor: '#EEF2FF',
                    color: '#422FAF',
                    fontWeight: 600,
                    px: 1
                  }}
                />
              </Divider>

              <List sx={{
                bgcolor: '#F9FAFB',
                borderRadius: '12px',
                p: 2
              }}>
                {instructions.map((item, index) => (
                  <ListItem key={index} sx={{ py: 1.5, px: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{
                        bgcolor: '#E5E7EB',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CheckCircleIcon sx={{
                          color: '#422FAF',
                          fontSize: '1.2rem'
                        }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={item}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: '#4B5563',
                          fontWeight: 500,
                          fontSize: '0.95rem'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Card>
        </motion.div>
      </Box>
      {confirmationModal && <ConfirmationModal confirmationModal={confirmationModal} />}

      <div className="w-screen">
        <ReviewSlider courseID={courseId} />

      </div>

      <Footer />
    </>
  );
};

export default CourseDetails;
