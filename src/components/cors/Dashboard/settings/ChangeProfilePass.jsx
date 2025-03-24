import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { changePassword } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"
import { toast } from 'react-hot-toast'

const PasswordInput = ({ 
  label, 
  id, 
  show, 
  setShow, 
  register, 
  validationRules, 
  errors, 
  placeholder 
}) => (
  <div className="relative flex flex-col gap-2 lg:w-[48%]">
    <label 
      htmlFor={id} 
      className="text-[#1A1A1A] font-medium"
    >
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        id={id}
        placeholder={placeholder}
        className="w-full bg-[#F9F9F9] border border-[#E5E5E5] text-[#1A1A1A] p-3 
                rounded-lg transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-[#422faf]"
        {...register(id, validationRules)}
      />
      <button
        type="button"
        onClick={() => setShow(prev => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] 
                hover:text-[#6B7280] transition-colors"
      >
        {show ? (
          <AiOutlineEyeInvisible className="w-5 h-5" />
        ) : (
          <AiOutlineEye className="w-5 h-5" />
        )}
      </button>
    </div>
    {errors[id] && (
      <span className="text-[12px] text-[#DC2626]">
        {errors[id].message}
      </span>
    )}
  </div>
)

const ChangeProfilePass = () => {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm()

  const submitPasswordForm = async (data) => {
    if(data.oldPassword === data.newPassword) {
      toast.error("New password must be different from current password")
      return
    }

    setLoading(true)
    try {
      await changePassword(token, data)
      toast.success("Password updated successfully")
      reset()
      navigate("/dashboard/my-profile")
    } catch (error) {
      toast.error(error.message || "Failed to update password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitPasswordForm)} className="w-full max-w-[1000px] mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">
          Security Settings
        </h1>
        <p className="text-[#6B7280] text-sm">
          Update your password to keep your account secure
        </p>
      </div>
      
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-8 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111827] mb-6 flex items-center">
          <span className="inline-block w-1 h-6 bg-[#422faf] rounded mr-3"></span>
          Change Password
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <PasswordInput 
            label="Current Password"
            id="oldPassword"
            show={showOldPassword}
            setShow={setShowOldPassword}
            placeholder="Enter current password"
            register={register}
            errors={errors}
            validationRules={{
              required: "Please enter your current password"
            }}
          />

          <PasswordInput 
            label="New Password"
            id="newPassword"
            show={showNewPassword}
            setShow={setShowNewPassword}
            placeholder="Enter new password"
            register={register}
            errors={errors}
            validationRules={{
              required: "Please enter your new password",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long"
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: "Password must include uppercase, lowercase, number and special character"
              },
              validate: (value) => 
                value !== watch("oldPassword") || 
                "New password must be different from current password"
            }}
          />
        </div>

        {/* Password Requirements */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 mb-6">
          <h3 className="font-medium text-[#111827] mb-2 text-sm">
            Password Requirements:
          </h3>
          <ul className="text-xs text-[#6B7280] space-y-1 list-disc pl-5">
            <li>Minimum 8 characters long</li>
            <li>Must include at least one uppercase letter (A-Z)</li>
            <li>Must include at least one lowercase letter (a-z)</li>
            <li>Must include at least one number (0-9)</li>
            <li>Must include at least one special character (@$!%*?&)</li>
            <li>Must be different from your current password</li>
          </ul>
        </div>

        {/* Security Tips */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="text-blue-500 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 text-sm">Security Tip</h4>
            <p className="text-xs text-blue-600 mt-1">
              Use a unique password that you don't use for other websites. Consider using a password manager to generate and store strong passwords.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
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
          text={loading ? "Updating..." : "Update Password"}
          disabled={loading}
          className="bg-[#422faf] hover:bg-[#3B27A1] text-white"
        />
      </div>
    </form>
  )
}

export default ChangeProfilePass