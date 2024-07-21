import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';
import { app } from '../../Firebase';
import { useDispatch } from 'react-redux';
import { googleLogin } from '../../services/operations/authAPI';
import { useNavigate } from 'react-router-dom';
const OAuth = () => {
    const dispatch=useDispatch()
    const navigate=useNavigate()
      const handleGoogleSignIn = async() => {
        try{
            const provider=new GoogleAuthProvider()
            const auth=getAuth(app)
            const result=await signInWithPopup(auth,provider)
            dispatch(googleLogin(result.user.email,navigate))
        }catch(err){
          console.log(err)
      }
    } 

  return (
    <div className='bg-white text-black w-full  px-2 py-3 mt-3 text-center rounded-md border-t-2 border-richblack-600 flex justify-center items-center gap-2 text-base font-medium tracking-wider select-none hover:scale-95 transition-all duration-200' onClick={handleGoogleSignIn}>
       <FcGoogle className='text-2xl' />   SignIn With Google 
    </div>
  )
}

export default OAuth
