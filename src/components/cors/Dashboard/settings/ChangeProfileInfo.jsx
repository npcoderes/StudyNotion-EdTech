import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { updateProfile } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../common/IconBtn";
import { toast } from "react-hot-toast";

const ChangeProfileInfo = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
      gender: user?.additionalDetails?.gender || "",
      contactNumber: user?.additionalDetails?.contactNumber || "",
      about: user?.additionalDetails?.about || "",
    },
  });

  const formsubmit = async (data) => {
    setLoading(true);
    try {
      await dispatch(updateProfile(token, data));
      toast.success("Profile updated successfully!");
      navigate("/dashboard/my-profile");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const FormInput = ({ label, id, type = "text", validation = {}, ...props }) => (
    <div className="flex flex-col gap-2 lg:w-[48%]">
      <label
        htmlFor={id}
        className="text-[#1A1A1A] font-medium"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="w-full bg-[#F9F9F9] border border-[#E5E5E5] text-[#1A1A1A] p-3 
                 rounded-lg transition-all duration-200 
                 focus:outline-none focus:ring-2 focus:ring-[#422faf]"
        {...register(id, validation)}
        {...props}
      />
      {errors[id] && (
        <span className="text-[12px] text-[#DC2626]">
          {errors[id].message}
        </span>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(formsubmit)} className="w-full max-w-[1000px] mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">
          Edit Profile
        </h1>
        <p className="text-[#6B7280] text-sm">
          Update your personal information and profile details
        </p>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 sm:p-8 mb-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-6 flex items-center">
          <span className="inline-block w-1 h-6 bg-[#422faf] rounded mr-3"></span>
          Profile Information
        </h2>

        {/* Name Fields */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <FormInput
            label="First Name"
            id="firstName"
            placeholder="Enter first name"
            validation={{
              required: "First name is required",
              minLength: {
                value: 2,
                message: "First name must be at least 2 characters",
              },
            }}
          />
          <FormInput
            label="Last Name"
            id="lastName"
            placeholder="Enter last name"
            validation={{
              required: "Last name is required",
            }}
          />
        </div>

        {/* DOB and Gender */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <FormInput
            label="Date of Birth"
            id="dateOfBirth"
            type="date"
            validation={{
              required: "Date of birth is required",
              validate: value => {
                // Check if date is not in the future
                if (new Date(value) > new Date()) {
                  return "Date cannot be in the future";
                }
                
                // Calculate if user is at least 10 years old
                const today = new Date();
                const birthDate = new Date(value);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                
                // Adjust age if birthday hasn't occurred yet this year
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                  age--;
                }
                
                return age >= 10 || "You must be at least 10 years old";
              }
            }}
          />
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label className="text-[#1A1A1A] font-medium">
              Gender
            </label>
            <select
              {...register("gender", { required: "Please select gender" })}
              className="w-full bg-[#F9F9F9] border border-[#E5E5E5] text-[#1A1A1A] p-3 
                       rounded-lg transition-all duration-200 
                       focus:outline-none focus:ring-2 focus:ring-[#422faf] appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: `right 0.5rem center`,
                backgroundRepeat: `no-repeat`,
                backgroundSize: `1.5em 1.5em`,
                paddingRight: `2.5rem`
              }}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {errors.gender && (
              <span className="text-[12px] text-[#DC2626]">
                {errors.gender.message}
              </span>
            )}
          </div>
        </div>

        {/* Contact Number */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <FormInput
            label="Contact Number"
            id="contactNumber"
            type="tel"
            placeholder="Enter contact number"
            validation={{
              required: "Contact number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit number",
              },
            }}
          />
          <div className="lg:w-[48%]"></div>
        </div>

        {/* About Section */}
        <div className="mb-2">
          <label className="text-[#1A1A1A] font-medium block mb-2">
            About
          </label>
          <textarea
            {...register("about", {
              required: "Please write something about yourself",
              maxLength: {
                value: 250,
                message: "About should not exceed 250 characters",
              },
            })}
            placeholder="Tell us about yourself"
            className="w-full bg-[#F9F9F9] border border-[#E5E5E5] text-[#1A1A1A] p-3 
                     rounded-lg transition-all duration-200 min-h-[120px]
                     focus:outline-none focus:ring-2 focus:ring-[#422faf]"
          ></textarea>
          {errors.about && (
            <span className="text-[12px] text-[#DC2626] block mt-1">
              {errors.about.message}
            </span>
          )}
          <div className="text-right text-[#6B7280] text-xs mt-1">
            Max 250 characters
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="px-6 py-2 rounded-lg border border-[#D1D5DB]
                   text-[#4B5563] hover:bg-[#F3F4F6] hover:border-[#9CA3AF]
                   transition-all duration-200"
          disabled={loading}
        >
          Cancel
        </button>
        <IconBtn
          type="submit"
          text={loading ? "Saving..." : "Save Changes"}
          disabled={loading}
        />
      </div>
    </form>
  );
};

export default ChangeProfileInfo;