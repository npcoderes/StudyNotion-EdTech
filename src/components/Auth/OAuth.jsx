// import React from "react";
// import { FcGoogle } from "react-icons/fc";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { signInWithPopup } from "firebase/auth";
// import { app } from "../../Firebase";
// import { useDispatch } from "react-redux";
// import { googleLogin } from "../../services/operations/authAPI";
// import { useNavigate } from "react-router-dom";
// const OAuth = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const handleGoogleSignIn = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const auth = getAuth(app);
//       const result = await signInWithPopup(auth, provider);
//       dispatch(googleLogin(result.user.email, navigate));
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <>
// <div className="flex justify-between text-richblack-300 items-center my-4 ">
//   <div className="h-[1px] bg-richblack-200 w-full"></div>
//   <div className="mx-2">OR</div>
//   <div className="h-[1px] bg-richblack-200 w-full"></div>
// </div>
//       <div
//         className="bg-richblack-900 text-richblue-50 w-full  px-2 py-3 mt-2 text-center rounded-3xl  border-richblack-700 flex justify-center items-center gap-2 text-base font-medium tracking-wider select-none hover:bg-richblack-800 transition-all duration-500"
//         onClick={handleGoogleSignIn}
//       >
//         <FcGoogle className="text-2xl" /> SignIn With Google
//       </div>
//     </>
//   );
// };

// export default OAuth;
