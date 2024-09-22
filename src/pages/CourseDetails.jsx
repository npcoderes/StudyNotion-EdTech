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
const CourseDetails = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [isInCart, setIsInCart] = useState(false);
  const {user}=useSelector(state=>state.profile)
  const dispatch = useDispatch();
  const [confirmationModal, setConfirmationModal] = useState(null);

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
          console.log("result............", result);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);

        // Handle error (e.g., show error message to user)
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, token]);
  useEffect(() => {
    const count = GetAvgRating(courseDetails?.courseDetails?.ratingAndReviews);
    setAvgReviewCount(count);
  }, [courseId, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!courseDetails) {
    return <div>No course details available.</div>;
  }
  let tags = JSON.parse(courseDetails?.courseDetails?.tag);
  let instructions = JSON.parse(courseDetails?.courseDetails?.instructions);



  // Buy Course handler
  const handleBuyCourse = () => {
    if (token) {
      const coursesId = [courseId]
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
      <div className="bg-richblack-800 min-h-[300px] w-full">
        <section className="w-11/12 max-w-maxContent mx-auto flex gap-2 py-10 relative">
          <div className=" min-h-[100px] w-full ">
            {/* heder part  */}
            <div className="flex flex-col gap-2  ">
              <p className="text-richblack-300 text-xs  tracking-widest">
                {" "}
                Course / Learning /{" "}
                <span className="text-yellow-25">
                  {" "}
                  {courseDetails?.courseDetails?.category?.name}{" "}
                </span>
              </p>
              <h1 className="text-richblack-25 text-4xl font-semibold tracking-wide">
                {courseDetails?.courseDetails?.courseName}
              </h1>
              <p className="text-richblack-50 text-xs w-[630px] mt-3 line-clamp-2 tracking-wide font-inter">
                {courseDetails?.courseDetails?.courseDescription}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-5">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} />
                <p className="text-richblack-50 text-sm">
                  ( {courseDetails?.courseDetails?.ratingAndReviews?.length}{" "}
                  ratings )
                </p>
                <p className="text-richblack-50 text-sm">
                  {courseDetails?.courseDetails?.studentsEnrolled?.length}{" "}
                  students enrolled
                </p>
              </div>
              <p className="text-richblack-50 text-sm">
                Created by {courseDetails?.courseDetails?.instructor?.firstName}{" "}
                {courseDetails?.courseDetails?.instructor?.lastName}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-richblack-50 text-sm flex items-center gap-2">
                  <RxInfoCircled className="text-richblack-5 text-base font-bold" />
                  {new Date(
                    courseDetails?.courseDetails?.createdAt
                  ).toLocaleDateString("en-US", {
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
          {/* card part  */}
          <div className="flex flex-col gap-2 p-4 bg-richblack-700 rounded-xl lg:absolute right-0 lg:max-w-[400px]  ">
            <Img
              src={courseDetails?.courseDetails?.thumbnail}
              className={" h-[200px] w-[350px] object-cover rounded-t-xl"}
            />
            <p className="text-richblack-5 text-2xl font-semibold">
              Rs. {courseDetails?.courseDetails?.price}
            </p>
            <div>
              {/* buttons  */}
             {
                user.accountType==="Student" && (<div className="flex  gap-3 flex-col ">
              {isInCart ? (
                <Button active={true}>
                  <span onClick={handleRemoveFromCart}>Remove from Cart</span>
                </Button>
              ) : (
                <Button active={false}>
                  <span onClick={handleAddToCart}>Add To Cart</span>
                </Button>
              )}
               <button onClick={handleBuyCourse} className="bg-yellow-50 text-richblack-900 text-center text-[13px] px-6 py-3 rounded-md font-bold hover:scale-95 transition-all w-full duration-200  ">
                Buy Now
               </button>
            </div>)

             } 
              <p className="text-[#DBDDEA] font-normal text-xs text-center py-3">
                30-Day Money-Back Guarantee
              </p>
              {/* information data  */}
              <div className="mt-4">
                <h4 className="text-richblack-5 font-semibold mb-2">
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
        </section>
      </div>
      {/* section 2  */}
      <div className="w-11/12  max-w-maxContent mx-auto mt-10">
        <div className="flex flex-col gap-4 w-2/3 border-2 border-richblack-700 rounded-xl p-6">
          <h1 className="text-richblack-5 text-3xl font-semibold">
            What you'll learn
          </h1>
          <div className="flex flex-col space-y-2">
            {tags.map((item, index) => (
              <div key={index}>
                <p className="text-richblack-50 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* section-3  */}
      <div className="w-11/12  max-w-maxContent mx-auto mt-10">
        <div className="flex flex-col gap-4 w-2/3 border-2 border-richblack-700 rounded-xl p-6">
          {courseDetails?.courseDetails?.courseContent?.map((item, index) => (
            <details key={index} open>
              <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                {/* sectionName */}
                <div className="flex items-center justify-between gap-x-3">
                  <RxDropdownMenu className="text-2xl text-richblack-50" />
                  <p className="font-semibold text-richblack-50">
                    {item.sectionName}
                  </p>
             
                </div>
                <div className="flex items-center justify-between gap-x-3">
                    <p className="text-yellow-50 text-sm">
                      {
                        item.subSection.length
                      } lecture
                    </p>
                    <p className="text-richblack-50 text-sm">  {courseDetails?.totalDuration} </p>
                </div>
              </summary>
              {/* render all sub-sections  */}
              <div className="px-6 pb-4">
                {item.subSection.map((data, index) => (
                  <details key={index} className="pt-2" open>
                    <summary className="flex items-center gap-x-3 cursor-pointer justify-between">
                      <div className="flex items-center gap-x-3">
                      <RxDropdownMenu className="text-2xl text-richblack-50" />
                      <p className="text-richblack-50 text-sm">{data.title}</p>
                      </div>
                      <p className="text-richblack-50 text-sm"> {data?.timeDuration} </p>
                    </summary>
                    <p className="text-richblack-50 text-sm ml-9 mt-2">-{data?.description}</p>
                    
                  </details>
                ))}
                  
                
              </div>
            </details>
          ))}
        </div>
      </div>
      {/* section-4  */}
      <div className="w-11/12  max-w-maxContent mx-auto mt-10">
        <div className="flex flex-col gap-4 w-2/3 border-2 border-richblack-700 rounded-xl p-6">
          <h1 className="text-richblack-5 text-3xl font-semibold">
            Author
          </h1>
          <div className="flex items-center gap-x-3">
            <Img src={courseDetails?.courseDetails?.instructor?.image} className="w-12 h-12 rounded-full" />
            <div>
              <p className="text-richblack-50 text-sm">
                {courseDetails?.courseDetails?.instructor?.firstName}{" "}
                {courseDetails?.courseDetails?.instructor?.lastName}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <h1 className="text-richblack-5 lg ">
              Instructions
            </h1>
            <ul className="list-disc list-inside text-richblack-50 text-sm">
              {instructions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal confirmationModal={confirmationModal} />}
    </>
  );
};

export default CourseDetails;
