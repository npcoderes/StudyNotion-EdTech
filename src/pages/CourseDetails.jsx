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
import {  FaMobile } from "react-icons/fa";
import { FaRegCaretSquareRight } from "react-icons/fa";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import { logout } from "../services/operations/authAPI";
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
  let tags = JSON.parse(courseDetails?.courseDetails?.tag || '[]');
  let instructions = JSON.parse(courseDetails?.courseDetails?.instructions || '[]');



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
      <div className="bg-[#121212] min-h-[300px] w-full mt-20 ">
        <section className="w-11/12 max-w-maxContent mx-auto flex flex-col sm:flex-row gap-4 py-10 relative">
          <div className="min-h-[100px] w-full">
            {/* Header part */}
            <div className="flex flex-col gap-2">
              <p className="text-[#BB86FC] text-xs tracking-widest">
                Course / Learning /{" "}
                <span className="text-[#BB86FC]">
                  {courseDetails?.courseDetails?.category?.name}
                </span>
              </p>
              <h1 className="text-[#E0E0E0] text-3xl sm:text-4xl w-[60%] font-semibold tracking-wide">
                {courseDetails?.courseDetails?.courseName}
              </h1>
              <p className="text-[#E0E0E0] text-xs sm:text-sm w-full sm:w-[630px] mt-3 line-clamp-2 tracking-wide font-inter">
                {courseDetails?.courseDetails?.courseDescription}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[#BB86FC]">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} />
                <p className="text-[#E0E0E0] text-sm">
                  ( {courseDetails?.courseDetails?.ratingAndReviews?.length} ratings )
                </p>
                <p className="text-[#E0E0E0] text-sm">
                  {courseDetails?.courseDetails?.studentsEnrolled?.length} students enrolled
                </p>
              </div>
              <p className="text-[#E0E0E0] text-sm">
                Created by {courseDetails?.courseDetails?.instructor?.firstName} {courseDetails?.courseDetails?.instructor?.lastName}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-[#E0E0E0] text-sm flex items-center gap-2">
                  <RxInfoCircled className="text-[#E0E0E0] text-base font-bold" />
                  {new Date(courseDetails?.courseDetails?.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-[#E0E0E0] text-sm flex items-center gap-2">
                  <MdLanguage className="text-[#E0E0E0] text-base font-bold" />
                  English
                </p>
                 <p className="text-[#E0E0E0] text-xs flex items-center gap-2">
                  <ScheduleIcon className="text-[#E0E0E0]  font-bold text-xs " />
                       Course Expire Time is 1 Year after Purchase
                </p>

              </div>
            </div>
          </div>
          {/* Card part */}
          <div className="flex flex-col gap-4 p-4 bg-[#1F1F1F] rounded-xl sm:max-w-[400px] w-full lg:absolute right-0">
            <Img
              src={courseDetails?.courseDetails?.thumbnail}
              className="h-[200px] w-full object-cover rounded-t-xl shadow-md shadow-[#000000]"
            />
            <p className="text-[#E0E0E0] text-2xl font-semibold">
              Rs. {courseDetails?.courseDetails?.price}
            </p>
            <div>
              {/* Buttons */}
              {user.accountType === "Student" && (
                <div className="flex gap-3 flex-col">
                  {isInCart ? (
                    <button onClick={handleRemoveFromCart} className="bg-[#FFFFFF99] text-[#121212] text-center text-[13px] px-6 py-3 rounded-md font-bold hover:scale-95 transition-all w-full duration-200">
                      <span>Remove from Cart</span>
                    </button>
                  ) : (
                    <button className="bg-[#FFFFFF] text-[#121212] text-center text-[13px] px-6 py-3 rounded-md font-bold hover:scale-95 transition-all w-full duration-200" onClick={handleAddToCart}>
                      <span>Add To Cart</span>
                    </button>
                  )}
                  <button onClick={handleBuyCourse} className="bg-[#422FAF] text-[#FFFFFF] text-center text-[13px] px-6 py-3 rounded-md font-bold hover:scale-95 transition-all w-full duration-200">
                    Buy Now
                  </button>
                </div>
              )}
              <p className="text-[#DBDDEA] font-normal text-xs text-center py-3">
                30-Day Money-Back Guarantee
              </p>
              {/* Information data */}
              <div className="mt-4">
                <h4 className="text-[#E0E0E0] font-semibold mb-2">
                  This course includes:
                </h4>
                <ul className="space-y-2">
                  <li className="text-[#06D6A0] flex items-center gap-2">
                    <FaClockRotateLeft className="text-xs" />
                    <span className="text-sm">8 hours on-demand video</span>
                  </li>
                  <li className="text-[#06D6A0] flex items-center gap-2">
                    <FaRegCaretSquareRight className="text-xs" />
                    <span className="text-xs">Full Lifetime access</span>
                  </li>
                  <li className="text-[#06D6A0] flex items-center gap-2">
                    <FaMobile className="text-xs" />
                    <span className="text-xs">Access on Mobile and TV</span>
                  </li>
                  <li className="text-[#06D6A0] flex items-center gap-2">
                    <GrCertificate className="text-xs" />
                    <span className="text-xs">Certificate of completion</span>
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
            boxShadow: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="600" color="text.primary">
              What you'll learn
            </Typography>
            <List>
              {tags.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
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
            boxShadow: 3
          }}>
            {courseDetails?.courseDetails?.courseContent?.map((item, index) => (
              <Accordion key={index} defaultExpanded={index === 0}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    bgcolor: 'grey.100',
                    '&:hover': { bgcolor: 'grey.200' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LibraryBooksIcon color="primary" />
                      <Typography variant="subtitle1" fontWeight="600">
                        {item.sectionName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Chip
                        size="small"
                        icon={<VideoIcon />}
                        label={`${item.subSection.length} lectures`}
                        color="primary"
                      />
                      <Chip
                        size="small"
                        icon={<TimeIcon />}
                        label={courseDetails?.totalDuration}
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: 'grey.50', p: 0 }}>
                  {item.subSection.map((data, subIndex) => (
                    <Accordion key={subIndex}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ '&:hover': { bgcolor: 'grey.100' } }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <PlayIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography>{data.title}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', mr: 2 }}>
                            <TimeIcon sx={{ mr: 0.5, fontSize: '0.9rem', color: 'text.secondary' }} />
                            {/* <Typography color="text.secondary">
                              {data?.timeDuration}
                            </Typography> */}
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ bgcolor: 'grey.50' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <DescriptionIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
                          <Typography color="text.secondary">
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
            p: 3,
            boxShadow: 3
          }}>
            <Typography variant="h4" gutterBottom fontWeight="600">
              Author
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={courseDetails?.courseDetails?.instructor?.image}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Typography variant="h6">
                {courseDetails?.courseDetails?.instructor?.firstName}{" "}
                {courseDetails?.courseDetails?.instructor?.lastName}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Instructions
            </Typography>
            <List>
              {instructions.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
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
