import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import CountryCode from '../../../data/countrycode.json'
import { apiConnector } from "../../../services/apiconnector"
import { endpoints } from "../../../services/apis"
import { useDispatch } from "react-redux"
import { userquery } from "../../../services/operations/authAPI"


const ContactUsForm = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
      register,
      handleSubmit,
      reset,
      formState: {errors, isSubmitSuccessful}
  } = useForm();

  const submitContactForm = async(data) => {
      console.log("Logging Data" , data);
      const{firstname,email,message}=data
      dispatch(userquery(firstname,message,email))
  }

  useEffect( () => {
      if(isSubmitSuccessful) {
          reset({
              email:"",
              firstname:"",
              lastname:"",
              message:"",
              phoneNo:"",
          })
      }
  },[reset, isSubmitSuccessful] );


  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={handleSubmit(submitContactForm)}
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstname" className="text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter first name"
            className="bg-white border border-gray-300 p-3 rounded-lg placeholder:text-sm"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="-mt-1 text-[12px] text-red-500">
              Please enter your name.
            </span>
          )}
        </div>
        
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastname" className="text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter last name"
            className="bg-white border border-gray-300 p-3 rounded-lg placeholder:text-sm"
            {...register("lastname")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address"
          className="bg-white border border-gray-300 p-3 rounded-lg placeholder:text-sm"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="-mt-1 text-[12px] text-red-500">
            Please enter your Email address.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="text-gray-700">
          Phone Number
        </label>

        <div className="flex gap-5">
          <div className="flex w-[81px] flex-col gap-2">
            <select
              name="countrycode"
              id="countrycode"
              className="bg-white border border-gray-300 p-3  px-4 rounded-lg placeholder:text-sm"
              {...register("countrycode", { required: true })}
            >
              {CountryCode.map((ele, i) => {
                return (
                    <option key={i} value={ele.code} selected={ele.country === "India"}>
                        {ele.code} - {ele.country}
                    </option>
                )
              })}
            </select>
          </div>

          <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            <input
              type="number"
              name="phonenumber"
              id="phonenumber"
              placeholder="12345 67890"
              className="bg-white border border-gray-300 p-3 rounded-lg placeholder:text-sm"
              {...register("phoneNo", {
                required: {
                  value: true,
                  message: "Please enter your Phone Number.",
                },
                maxLength: { value: 12, message: "Invalid Phone Number" },
                minLength: { value: 10, message: "Invalid Phone Number" },
              })}
            />
          </div>
        </div>
        {errors.phoneNo && (
          <span className="-mt-1 text-[12px] text-red-500">
            {errors.phoneNo.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-gray-700">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="7"
          placeholder="Enter your message here"
          className="bg-white border border-gray-300 p-3 rounded-lg placeholder:text-sm"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="-mt-1 text-[12px] text-red-500">
            Please enter your Message.
          </span>
        )}
      </div>

      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-[#422faf] px-6 py-3 text-center text-[13px] font-bold text-white shadow-md 
         ${!loading && "transition-all duration-200 hover:scale-95 hover:shadow-none"} 
         disabled:bg-gray-400 sm:text-[16px]`}
      >
        Send Message
      </button>
    </form>
  )
}

export default ContactUsForm
