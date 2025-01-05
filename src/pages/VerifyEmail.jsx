import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OTPInput from "react-otp-input";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { sendOtp,signUp } from "../services/operations/authAPI";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const { signup, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let toastid=null;

  useEffect(() => {
    if (!signup) {
      navigate("/signup");
    }
  }, []);


const handleSubmit=(e)=>{
    e.preventDefault();
    const{
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        reason
    }=signup
  dispatch(signUp(accountType, firstName, lastName, email, password, confirmPassword, otp,reason, navigate))

}
return <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center text-richblack-900 ">
     {
            loading ? (
                    toastid = toast.loading("Loading...") 
                    
            ) : (
             <div className="max-w-[500px] p-4 lg:p-8 flex flex-col gap-6">
                    
                    {toast.dismiss(toastid)}
                 <div className="space-y-2">
                    <h1 className="text-3xl font-semibold ">Verify Email</h1>
                    <p className="text-lg text-richblack-700">A verification code has been sent to you. Enter the code below</p>
                 </div>
                 <form action="" onSubmit={handleSubmit}>
                    <OTPInput 
                     value={otp}
                     onChange={setOtp}
                     numInputs={6}
                     renderInput={(props) => (
                         <input
                             {...props}
                             type="text" 
                             placeholder="-"
                             style={{
                                 boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                    borderRadius: "0.5rem",
                             }}
                             className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50 " 
                         />
                     )}
                     containerStyle={{
                         justifyContent: "space-between",
                         gap: "0 6px",
                     }}
                    />
                    <button type="submit" className="bg-[#422faf] px-3 py-2 mt-4 rounded-lg  w-full text-black shadow-inner font-medium ">
                            Verify Email
 
                    </button>
                 </form>
                 <div className="flex justify-between items-center ">
                    <Link to={"/signup"}>
                        <p className="flex items-center gap-2 text-sm"> <BiArrowBack /> Back to Sign Up</p>
                    </Link>
                    <button className="flex  items-center gap-2 text-[#422faf] text-sm" 
                    onClick={() => dispatch(sendOtp(signup.email))}
                    > 
                            <RxCountdownTimer />
                            Resend Code 
                    </button>
                 </div>
             </div>

            )
     }
</div>
};

export default VerifyEmail;
