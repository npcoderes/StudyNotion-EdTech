import React from 'react'
import ChangeProfilePic from './settings/ChangeProfilePic'
import ChangeProfileInfo from './settings/ChangeProfileInfo'
import ChangeProfilePass from './settings/ChangeProfilePass'
import DeleteProfile from './settings/DeleteProfile'
import { FiEdit } from 'react-icons/fi'
const ProfileSet = () => {
  return (
    <div className=' '>
        <h1 className='mb-14 text-3xl font-medium text-[#422faf] flex items-center gap-x-2 first-letter'>Edit Profile <FiEdit className='text-3xl text-[#422faf] hover:text-[#422faf]/60 transition-all duration-300' /></h1>
        {/* Change profile picture section  */}
         <ChangeProfilePic />
         {/* Add/Edit profile details section  */}
         <ChangeProfileInfo />
         {/* Change Password section  */}
         <ChangeProfilePass />
         {/* Delete Profile  */}
         <DeleteProfile />

    </div>
  )
}

export default ProfileSet