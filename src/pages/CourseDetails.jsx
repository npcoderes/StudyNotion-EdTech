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
import Button from "../components/cors/homepage/Button";
import { useDispatch } from "react-redux";
import { addItem, removeItem } from "../slices/cartSlice";
import { FaClockRotateLeft } from "react-icons/fa6";
import { GrCertificate } from "react-icons/gr";
import { FaCheckCircle, FaMobile } from "react-icons/fa";
import { FaRegCaretSquareRight } from "react-icons/fa";
import { RxDropdownMenu } from "react-icons/rx";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import { logout } from "../services/operations/authAPI";
const CourseDetails = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { token } = useSelector(state => state.auth);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [isInCart, setIsInCart] = useState(false);
  const {user}=useSelector(state=>state.profile)
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
          // console.log("courseDetails?.courseDetails?.ratingAndReviews............", result?.courseDetails?.ratingAndReviews);   
          const count = GetAvgRating(result?.courseDetails?.ratingAndReviews);
          // setAvgReviewCount(count); 
          // console.log("result............", result);
          if(result.success===false)
          {
            setEr(true);
            toast.error("Something went wrong please login again ")
            dispatch(logout(navigate))
          }
        }
      } catch (error) 
      {
        
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
      <p className="text-richblack-300 text-xs tracking-widest">
        Course / Learning /{" "}
        <span className="text-[#bb86fc]">
          {courseDetails?.courseDetails?.category?.name}
        </span>
      </p>
      <h1 className="text-richblack-25 text-3xl sm:text-4xl font-semibold tracking-wide">
        {courseDetails?.courseDetails?.courseName}
      </h1>
      <p className="text-richblack-50 text-xs sm:text-sm w-full sm:w-[630px] mt-3 line-clamp-2 tracking-wide font-inter">
        {courseDetails?.courseDetails?.courseDescription}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-[#bb86fc]">{avgReviewCount}</span>
        <RatingStars Review_Count={avgReviewCount} />
        <p className="text-richblack-50 text-sm">
          ( {courseDetails?.courseDetails?.ratingAndReviews?.length} ratings )
        </p>
        <p className="text-richblack-50 text-sm">
          {courseDetails?.courseDetails?.studentsEnrolled?.length} students enrolled
        </p>
      </div>
      <p className="text-richblack-50 text-sm">
        Created by {courseDetails?.courseDetails?.instructor?.firstName} {courseDetails?.courseDetails?.instructor?.lastName}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-richblack-50 text-sm flex items-center gap-2">
          <RxInfoCircled className="text-richblack-5 text-base font-bold" />
          {new Date(courseDetails?.courseDetails?.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="text-richblack-50 text-sm flex items-center gap-2">
          <MdLanguage className="text-richblack-5 text-base font-bold" />
          English
        </p>
      </div>
    </div>
  </div>
  {/* Card part */}
  <div className="flex flex-col gap-4 p-4 bg-richblack-700 rounded-xl sm:max-w-[400px] w-full lg:absolute right-0">
    <Img
      src={courseDetails?.courseDetails?.thumbnail}
      className="h-[200px] w-full object-cover rounded-t-xl shadow-md shadow-richblack-800"
    />
    <p className="text-richblack-5 text-2xl font-semibold">
      Rs. {courseDetails?.courseDetails?.price}
    </p>
    <div>
      {/* Buttons */}
      {user.accountType === "Student" && (
        <div className="flex gap-3 flex-col">
          {isInCart ? (
            <button onClick={handleRemoveFromCart} className="bg-white/60 text-richblack-900 text-center text-[13px] px-6 py-3 rounded-md font-bold hover:scale-95 transition-all w-full duration-200">
              <span>Remove from Cart</span>
            </button>
          ) : (
            <button className="bg-white text-richblack-900 text-center text-[13px] px-6 py-3 rounded-md font-bold hover:scale-95 transition-all w-full duration-200" onClick={handleAddToCart}>
              <span>Add To Cart</span>
            </button>
          )}
          <button onClick={handleBuyCourse} className="bg-[#422faf] text-white text-center text-[13px] px-6 py-3 rounded-md font-bold hover:scale-95 transition-all w-full duration-200">
            Buy Now
          </button>
        </div>
      )}
      <p className="text-[#DBDDEA] font-normal text-xs text-center py-3">
        30-Day Money-Back Guarantee
      </p>
      {/* Information data */}
      <div className="mt-4">
        <h4 className="text-richblack-5 font-semibold mb-2">
          This course includes:
        </h4>
        < ul className="space-y-2">
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
      <div className="w-11/12 max-w-maxContent mx-auto mt-10 sm:w-full">
        <div className="flex flex-col gap-4 w-2/3 border-2 border-[#D1D5DB] rounded-xl p-6 bg-[#FFFFFF] shadow-md max-sm:w-full">
          <h1 className="text-[#1F2937] text-3xl font-semibold">
            What you'll learn
          </h1>
          <div className="flex flex-col space-y-2">
            {tags.map((item, index) => (
              <div key={index}>
                <p className="text-[#374151] text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
{/* section-3 */}
<div className="w-11/12 max-w-maxContent mx-auto mt-10">
  <div className="flex flex-col gap-4 w-2/3 border-2 border-[#D1D5DB] rounded-xl p-6 bg-[#FFFFFF] shadow-md max-sm:w-full">
    {courseDetails?.courseDetails?.courseContent?.map((item, index) => (
      <details key={index} open className="transition-all duration-300 ease-in-out">
        <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-[#D1D5DB] py-3 bg-[#E5E7EB] rounded-md transition-all duration-700 p-3 hover:bg-[#D1D5DB]">
          <div className="flex items-center justify-between gap-x-3">
            <RxDropdownMenu className="text-2xl text-[#4B5563]" />
            <p className="font-semibold text-[#1F2937]">
              {item.sectionName}
            </p>
          </div>
          <div className="flex items-center justify-between gap-x-3">
            <p className="text-[#4B5563] text-sm">
              {item.subSection.length} lecture
            </p>
            <p className="text-[#6B7280] text-sm">{courseDetails?.totalDuration}</p>
          </div>
        </summary>
        <div className="px-6 pb-4 bg-[#F9FAFB] rounded-md transition-all duration-300 ease-in-out">
          {item.subSection.map((data, index) => (
            <details key={index} className="pt-2 transition-all duration-300 ease-in-out">
              <summary className="flex items-center gap-x-3 cursor-pointer justify-between bg-[#ffffff] rounded-md transition-colors duration-200 p-4 hover:bg-[#F3F4F6]">
                <div className="flex items-center gap-x-3">
                  <RxDropdownMenu className="text-xl text-[#4B5563]" />
                  <p className="text-[#1F2937] text-sm">{data.title}</p>
                </div>
                <p className="text-[#6B7280] text-sm">{data?.timeDuration}</p>
              </summary>
              <p className="text-[#6B7280] text-sm ml-9 mt-2">-{data?.description}</p>
            </details>
          ))}
        </div>
      </details>
    ))}
  </div>
</div>

      {/* section-4  */}
      <div className="w-11/12 max-w-maxContent mx-auto mt-10 mb-20">
        <div className="flex flex-col gap-4 w-2/3 border-2 border-[#D1D5DB] rounded-xl p-6 bg-[#FFFFFF] shadow-md max-sm:w-full">
          <h1 className="text-[#1F2937] text-3xl font-semibold">
            Author
          </h1>
          <div className="flex items-center gap-x-3">
            <Img src={courseDetails?.courseDetails?.instructor?.image} className="w-12 h-12 rounded-full" />
            <div>
              <p className="text-[#374151] text-sm">
                {courseDetails?.courseDetails?.instructor?.firstName}{" "}
                {courseDetails?.courseDetails?.instructor?.lastName}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <h1 className="text-[#1F2937]">
              Instructions
            </h1>
            <ul className="list-disc list-inside text-[#374151] text-sm">
              {instructions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal confirmationModal={confirmationModal} />}

      <Footer />
    </>
  );
};

export default CourseDetails;
