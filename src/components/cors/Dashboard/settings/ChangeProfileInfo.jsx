import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { updateProfile } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../common/IconBtn";

const ChangeProfileInfo = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const formsubmit = async (data) => {
    try {
      dispatch(updateProfile(token,data))
    } catch (e) {
      console.error("change profile error  "+e);
    }
  };
  return (
    <>
      <form action="" onSubmit={handleSubmit(formsubmit)}>
        <div className="my-10 flex  flex-col rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 gap-5">
          <h2 className="text-lg font-semibold text-richblack-5">Profile Information</h2>
          {/* firstname-lastname  */}
          <div className="flex flex-col gap-5 lg:flex-row">
            {/* First Name  */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="firstName" className="label-style">First Name </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter first name"
                className="form-style"
                {...register("firstName", { required: true })}
                defaultValue={user?.firstName}
              />
              {errors.firstName && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your first name.
                </span>
              )}
            </div>
            {/* Last Name  */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="lastName" className="label-style">Last Name </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter Last name"
                className="form-style"
                {...register("lastName", { required: true })}
                defaultValue={user?.lastName}
              />
              {errors.firstName && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Last name.
                </span>
              )}
            </div>
          </div>
          {/* DOB and Gender  */}
          <div className="flex flex-col gap-5 lg:flex-row">
            {/* DOB  */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="dateOfBirth" className="label-style">Date of Birth </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                className="form-style"
                {...register("dateOfBirth", { required: true })}
                defaultValue={user?.dateOfBirth}
              />
              {errors.dob && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Date of Birth.
                </span>
              )}
            </div>
            {/* Gender  */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="gender" className="label-style">Gender </label>
              <select
                name="gender"
                id="gender"
                className="form-style"
                {...register("gender", { required: true })}
                defaultValue={user?.gender}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please select your Gender.
                </span>
              )}
            </div>
          </div>
          {/* Contact No and about  */}
          <div className="flex flex-col gap-5 lg:flex-row">
            {/* Contact Number  */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="contactNumber" className="label-style">Contact Number </label>
              <input
                type="text"
                name="contactNumber"
                id="contactNumber"
                placeholder="Enter Contact Number"
                className="form-style"
                {...register("contactNumber", { required: true })}
                defaultValue={user?.contactNumber}
              />
              {errors.contactNumber && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Contact Number.
                </span>
              )}
            </div>
            {/* About  */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="about" className="label-style">About </label>
              <input
                type="text"
                name="about"
                id="about"
                placeholder="Enter Bio Details"
                className="form-style"
                {...register("about", { required: true })}
                defaultValue={user?.additionalDetails?.about}
              />
              {errors.about && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter about yourself.
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              navigate("/dashboard/my-profile");
            }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Save" />
        </div>
      </form>
    </>
  );
};

export default ChangeProfileInfo;
