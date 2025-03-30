import React, { useEffect, useState } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay, EffectCoverflow } from "swiper/modules";

// Import components and icons
import Card from "./Card";
import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";

// Custom navigation arrows component
const CustomNavigation = ({ navigationPrevRef, navigationNextRef, title, viewAllLink }) => (
  <div className="flex items-center justify-between mb-6">
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3"
    >
      <span className="bg-gradient-to-r from-[#422FAF] to-[#6366F1] p-2 rounded-lg text-white">
        <FaGraduationCap size={24} />
      </span>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title || "Featured Courses"}</h2>
    </motion.div>
    
    <div className="flex items-center gap-4">
      {viewAllLink && (
        <a 
          href={viewAllLink} 
          className="text-[#422FAF] hover:text-[#6366F1] font-medium text-sm flex items-center"
        >
          View All
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      )}
      
      <div className="flex items-center gap-2">
        <button 
          ref={navigationPrevRef}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 hover:text-[#422FAF] transition-all duration-200 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        
        <button 
          ref={navigationNextRef}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 hover:text-[#422FAF] transition-all duration-200 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

const Course_Slider = ({ 
  Courses, 
  title,
  viewAllLink,
  effect = "slide", // "slide" or "coverflow"
  autoplay = false,
  loop = true,
  centeredSlides = false
}) => {
  const [navigationPrevRef, setNavigationPrevRef] = useState(null);
  const [navigationNextRef, setNavigationNextRef] = useState(null);
  const [smallScreen, setSmallScreen] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);

  // Handle empty or missing courses
  const coursesToShow = Array.isArray(Courses) && Courses.length > 0 ? Courses : [];

  useEffect(() => {
    const handleResize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse flex items-center gap-3 mb-6">
          <div className="bg-gray-300 dark:bg-gray-700 w-10 h-10 rounded-lg"></div>
          <div className="bg-gray-300 dark:bg-gray-700 h-8 w-48 rounded-md"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="bg-gray-300 dark:bg-gray-700 rounded-xl h-72 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Handle empty courses
  if (coursesToShow.length === 0) {
    return (
      <div className="w-full py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <FaGraduationCap size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Courses Available</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            We couldn't find any courses to display at the moment. Please check back later.
          </p>
        </motion.div>
      </div>
    );
  }

  // Configuration for different effects
  const swiperConfig = {
    slide: {
      slidesPerView: 1,
      spaceBetween: 20,
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 25 }
      },
      modules: [Navigation, Pagination, Mousewheel, Keyboard, Autoplay]
    },
    coverflow: {
      effect: 'coverflow',
      centeredSlides: true,
      slidesPerView: 1.5,
      spaceBetween: 0,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 200,
        modifier: 1,
        slideShadows: true
      },
      breakpoints: {
        640: { slidesPerView: 2.2 },
        1024: { slidesPerView: 2.7 }
      },
      modules: [Navigation, Pagination, Mousewheel, Keyboard, EffectCoverflow, Autoplay]
    }
  };

  const selectedEffect = swiperConfig[effect] || swiperConfig.slide;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-4 px-1"
    >
      {/* <CustomNavigation 
        navigationPrevRef={navigationPrevRef}
        navigationNextRef={navigationNextRef}
        title={title}
        viewAllLink={viewAllLink}
      /> */}

      <Swiper
        {...selectedEffect}
        loop={loop}
        centeredSlides={centeredSlides || effect === 'coverflow'}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
          renderBullet: function (index, className) {
            return `<span class="${className} w-2.5 h-2.5 opacity-70 mx-1"></span>`;
          }
        }}
        navigation={{
          prevEl: navigationPrevRef,
          nextEl: navigationNextRef
        }}
        autoplay={autoplay && {
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        mousewheel={false}
        keyboard={true}
        onSwiper={(swiper) => {
          // Override swiper instance navigation
          setTimeout(() => {
            if (swiper.navigation) {
              swiper.navigation.prevEl = navigationPrevRef;
              swiper.navigation.nextEl = navigationNextRef;
              swiper.navigation.update();
            }
          });
        }}
        className="course-slider"
      >
        {coursesToShow.map((course, i) => (
          <SwiperSlide key={i} className="pb-12">
            <Card course={course} />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom pagination styles */}
      <style jsx>{`
        .course-slider .swiper-pagination-bullet {
          background: rgba(66, 47, 175, 0.7);
        }
        .course-slider .swiper-pagination-bullet-active {
          background: #422FAF;
        }
      `}</style>
    </motion.div>
  );
};

export default Course_Slider;