import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { RxCross2 } from "react-icons/rx";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { resetPassword } from "../services/operations/authAPI"

function UpdatePassword() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { loading } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const[len,setlen]=useState(false)
  const[low,setLow]=useState(false)
  const[upp,setUpp]=useState(false)
  const[key,setKey]=useState(false)
  const[digit,setdigit]=useState(false)


  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { password, confirmPassword } = formData

  const validatePassword = (password) => {
    setlen(password.length >= 8);
    setLow(/[a-z]/.test(password));
    setUpp(/[A-Z]/.test(password));
    setKey(/[@$!%*?&#]/.test(password));
    setdigit(/[0-9]/.test(password));
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const handleOnSubmit = (e) => {
    if(formData.password !== formData.confirmPassword){
      alert("Password and Confirm Password does not match")
      return
    }
    e.preventDefault()
    const token = location.pathname.split("/").at(-1)
    dispatch(resetPassword(password, confirmPassword, token, navigate))
  }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-900">
            Choose new password
          </h1>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-300">
            Almost done. Enter your new password and youre all set.
          </p>
          <form onSubmit={handleOnSubmit}>
            <label className="relative">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-900">
                New Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
             
                placeholder="Enter Password"
                className="w-full bg-richblack-800 text-richblack-25 p-3 rounded-lg leading-6 text-sm my-2 border-b-[1px] border-richblack-600"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[45px] z-[10] cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>
            <label className="relative mt-3 block">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-900">
                Confirm New Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm Password"
                className="w-full bg-richblack-800 text-richblack-25 p-3 rounded-lg leading-6 text-sm my-2 border-b-[1px] border-richblack-600"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[45px] z-[10] cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>

            <div className="flex flex-wrap gap-5 my-1 flex-1">
              <p className="flex items-center gap-2">
                {low ? <FaCheckCircle className="text-caribbeangreen-200" /> : <FaTimesCircle className="text-pink-500" />}
                <span className={`${low ? "text-caribbeangreen-200" : "text-pink-500"}`}>one lowercase character</span>
              </p>
              <p className="flex items-center gap-2">
                {key ? <FaCheckCircle className="text-caribbeangreen-200" /> : <FaTimesCircle className="text-pink-500" />}
                <span className={`${key ? "text-caribbeangreen-200" : "text-pink-500"}`}>one special character</span>
              </p>
              <p className="flex items-center gap-2">
                {upp ? <FaCheckCircle className="text-caribbeangreen-200" /> : <FaTimesCircle className="text-pink-500" />}
                <span className={`${upp ? "text-caribbeangreen-200" : "text-pink-500"}`}>one uppercase character</span>
              </p>
              <p className="flex items-center gap-2">
                {len ? <FaCheckCircle className="text-caribbeangreen-200" /> : <FaTimesCircle className="text-pink-500" />}
                <span className={`${len ? "text-caribbeangreen-200" : "text-pink-500"}`}>8 character minimum</span>
              </p>
              <p className="flex items-center gap-2">
                {digit ? <FaCheckCircle className="text-caribbeangreen-200" /> : <FaTimesCircle className="text-pink-500" />}
                <span className={`${digit ? "text-caribbeangreen-200" : "text-pink-500"}`}>one number</span>
              </p>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              Reset Password
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-600">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdatePassword