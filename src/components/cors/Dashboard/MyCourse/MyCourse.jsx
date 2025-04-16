import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoAddOutline } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { HiOutlineAdjustments } from "react-icons/hi";
import { FiBookOpen, FiUsers, FiBarChart2 } from "react-icons/fi";
import RenderInstructorCourses from './RenderInstructorCourses';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { apiConnector } from '../../../../services/apiconnector';
import { profileEndpoints } from '../../../../services/apis';

const MyCourse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [statsData, setStatsData] = useState({
    totalCourses: 0,
    totalStudents: 0,
    completionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  // Fetch instructor stats
  useEffect(() => {
    const fetchInstructorStats = async () => {
      setIsLoading(true);
      try {
        const response = await apiConnector(
          "GET",
          profileEndpoints.GET_INSTRUCTOR_STATS_API,
          null,
          { Authorization: `Bearer ${token}` }
        );
        console.log("Instructor Stats Response:", response.data); 

        if (response.data.success) {
          setStatsData({
            totalCourses: response.data.data.totalCourses || 0,
            totalStudents: response.data.data.totalStudents || 0,
            completionRate: response.data.data.completionRate || 0
          });
        }
      } catch (error) {
        console.error("Error fetching instructor stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchInstructorStats();
    }
  }, [token]);

  // Create stats array from the fetched data
  const stats = [
    { icon: <FiBookOpen />, value: statsData.totalCourses, label: 'Total Courses' },
    { icon: <FiUsers />, value: statsData.totalStudents, label: 'Enrolled Students' },
    
  ];

  return (
    <motion.div 
      className='w-full max-w-maxContent mx-auto px-4 sm:px-6'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pt-6'>
        <div>
          <h1 className='text-3xl font-semibold text-[#111827] mb-1'>
            My Courses
          </h1>
          <p className='text-[#6B7280]'>
            Manage and track your created courses
          </p>
        </div>
        
        <Link to='/dashboard/add-course'>
          <motion.button
            className='flex items-center gap-2 px-4 py-2.5 bg-[#422FAF] text-white rounded-lg hover:bg-[#3B27A1] transition-colors shadow-sm'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IoAddOutline className='text-xl' />
            <span className='font-medium'>Create New Course</span>
          </motion.button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {isLoading ? (
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#EEF2FF] text-[#422FAF] rounded-lg">
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <div className="w-full">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#EEF2FF] text-[#422FAF] rounded-lg">
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-[#111827]">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </div>
                  <div className="text-sm text-[#6B7280]">{stat.label}</div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Search and Filter Section */}
      <div className='mb-6 p-4 bg-white rounded-xl border border-[#E5E7EB] shadow-sm'>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BiSearch className="text-[#9CA3AF]" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:ring-[#422FAF] focus:border-[#422FAF] text-sm"
              placeholder="Search courses by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <select
              className="w-full sm:w-auto px-3 py-2.5 border border-[#E5E7EB] rounded-lg focus:ring-[#422FAF] focus:border-[#422FAF] text-sm bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Courses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E5E7EB]">
          <div className='text-sm text-[#4B5563] flex items-center gap-2'>
            <HiOutlineAdjustments />
            <span>Filter by status</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1.5 text-xs rounded-full ${filterStatus === 'all' 
                ? 'bg-[#422FAF] text-white' 
                : 'bg-[#F3F4F6] text-[#4B5563]'}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1.5 text-xs rounded-full ${filterStatus === 'published' 
                ? 'bg-[#422FAF] text-white' 
                : 'bg-[#F3F4F6] text-[#4B5563]'}`}
              onClick={() => setFilterStatus('published')}
            >
              Published
            </button>
            <button 
              className={`px-3 py-1.5 text-xs rounded-full ${filterStatus === 'draft' 
                ? 'bg-[#422FAF] text-white' 
                : 'bg-[#F3F4F6] text-[#4B5563]'}`}
              onClick={() => setFilterStatus('draft')}
            >
              Draft
            </button>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className='bg-white rounded-xl border border-[#E5E7EB] shadow-sm mb-8'>
        <RenderInstructorCourses 
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          setStatsData={setStatsData}
        />
      </div>
    
    </motion.div>
  );
};

export default MyCourse;