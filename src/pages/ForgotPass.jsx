import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { BiArrowBack } from 'react-icons/bi'
import { Link } from 'react-router-dom'

import { getPasswordResetToken } from '../services/operations/authAPI'
const ForgotPass = () => {
    const[email,setEmail]=useState("")
    const [emailsent,setemailsent]=useState(false)
    const dispatch=useDispatch()
    const{loading}=useSelector((state)=>state.auth)
    const handleSubmit=(e)=>{
        e.preventDefault()
       dispatch(getPasswordResetToken(email, setemailsent))
  
    }
    let toastid=null

  return (
    <div className='text-richblack-5 grid place-items-center min-h-[calc(100vh-3.5rem)]'>
      {
        loading ? (toastid=toast.loading("Loading....")):(
       
          <div className='max-w-[500px] flex flex-col gap- p-4 lg:p-8'>
              {toast.dismiss(toastid)}
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                {!emailsent ? "Reset Your Password" : "Check Email"}
            </h1>
            <p className="my-4 text-lg text-richblack-100">{!emailsent?"Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery":(<p>
                We have sent the reset email to  {email}
            </p>) }</p>
            <form action="" onSubmit={handleSubmit}>
                {!emailsent && (
                    <label htmlFor="email" className='w-full'>
                        <p className='mb-1 text-[0.875rem] tracking-wider leading-[1.375rem] text-richblack-5'>Email Address<sup className='text-pink-200'>*</sup></p>
                        <input type="email"
                               name='email'
                               placeholder='Enter your email'
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               required
                               className='w-full bg-richblack-800 text-richblack-25 p-3 rounded-lg leading-6 text-sm my-2 border-b-[1px] border-richblack-600'
                        />
                    </label>
                )}
                <button type='submit' className='bg-yellow-50 px-3 py-2 mt-4 rounded-lg text-base  w-full text-black shadow-inner font-medium '>
                     {!emailsent ? "Send Reset Email" : "Send  Email Again"}
                </button>
            </form>
            <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
          </div>
        )
      }
    </div>
  )
}

export default ForgotPass
