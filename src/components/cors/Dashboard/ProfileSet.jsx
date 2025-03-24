import React from 'react'
import ChangeProfilePic from './settings/ChangeProfilePic'
import ChangeProfileInfo from './settings/ChangeProfileInfo'
import ChangeProfilePass from './settings/ChangeProfilePass'
import DeleteProfile from './settings/DeleteProfile'
import { useSelector } from 'react-redux'
import { FiEdit } from 'react-icons/fi'

const ProfileSet = () => {
  const { user } = useSelector((state) => state.profile)

  return (
    <div className="container mx-auto max-w-[1000px] p-4 sm:p-6  text-[#1A1A1A] dark:text-white rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="border-b border-gray-200 dark:border-richblack-700 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-medium flex items-center gap-x-3">
          <span className="bg-gradient-to-r from-[#422faf] to-[#5647c9] bg-clip-text text-transparent">
            Edit Profile
          </span>
          <FiEdit className="text-2xl sm:text-3xl text-[#422faf] hover:text-[#422faf]/80 transition-all duration-300" />
        </h1>
      </div>

      {/* Profile Sections */}
      <div className="space-y-8">
        {/* Change Profile Picture Section */}
        <section className="bg-gray-50 dark:bg-richblack-800 rounded-xl p-6">
          <ChangeProfilePic />
        </section>

        {/* Profile Details Section */}
        <section className="bg-gray-50 dark:bg-richblack-800 rounded-xl p-6">
          <ChangeProfileInfo />
        </section>

        {/* Password Section */}
        <section className="bg-gray-50 dark:bg-richblack-800 rounded-xl p-6">
          <ChangeProfilePass />
        </section>

        {/* Delete Profile Section - Only for non-instructors */}
        {user.accountType !== "Instructor" && (
          <section className="bg-gray-50 dark:bg-richblack-800 rounded-xl p-6">
            <DeleteProfile />
          </section>
        )}
      </div>
    </div>
  )
}

export default ProfileSet