import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SlideBar from '../components/cors/Dashboard/SlideBar';


const Dashboard = () => {
  const { loading: authloading } = useSelector((state) => state.auth);
  const { loading: profileloading } = useSelector((state) => state.profile);
  
  if (profileloading || authloading) {
    return (
      <div className='mt-10'>
        Loading...
      </div>
    );
  }

  return (
<div className=' flex min-h-[calc(100vh-3.5rem)] bg-[#fff] text-[#000] w-full py-14'>
  <div className=' relative left-0 bottom-0'>
    <SlideBar />
  </div>
  <div className='overflow-auto flex-grow '>
    <div className='py-10 max-w-[1000px] w-11/12 mx-auto h-full max-sm:mx-10px'>
      <Outlet />
    </div>
  </div>
</div>

  );
};

export default Dashboard;