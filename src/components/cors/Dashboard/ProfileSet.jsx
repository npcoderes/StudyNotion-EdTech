import React from 'react'
import ChangeProfilePic from './settings/ChangeProfilePic'
import ChangeProfileInfo from './settings/ChangeProfileInfo'
import ChangeProfilePass from './settings/ChangeProfilePass'
import DeleteProfile from './settings/DeleteProfile'

const ProfileSet = () => {
  return (
    <div className=' '>
        <h1 className='mb-14 text-3xl font-medium text-richblack-5'>Edit Profile</h1>
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