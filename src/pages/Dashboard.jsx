import React from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SlideBar from '../components/cors/Dashboard/SlideBar'


const Dashboard = () => {
  const { loading: authloading } = useSelector((state) => state.auth)
  const { loading: profileloading } = useSelector((state) => state.profile)
  if (profileloading || authloading) {
    return (
      <div className='mt-10'>
        Loading...
      </div>
    )
  }
  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)] bg-richblack-800 text-richblack-25  w-full'>
      <SlideBar />
      <div className='h-[calc(100vh-3.5rem)] overflow-auto w-[calc(100%-222px)]'>
            <div className='py-10 max-w-[1000px] w-11/12 mx-auto '>
                <Outlet  />
            </div>
        </div>
    </div>

  )
}

export default Dashboard