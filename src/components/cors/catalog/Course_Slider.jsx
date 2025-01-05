import React, { useEffect, useState } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

import Card from "./Card";

const Course_Slider = ({ Courses }) => {

  const [smallScreen, setSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <Swiper
        slidesPerView={3} // default value for larger screens
        spaceBetween={25}
        loop={true}

        navigation={true}
        pagination={{ clickable: true }}

        mousewheel={false}
        keyboard={true}
        modules={[Navigation, Mousewheel, Keyboard]}
      >
        {Courses.map((course, i) =>
          smallScreen ? (
            <Card course={course} Height={"h-[250px]"} />
          ) : (
            <SwiperSlide key={i}>
              <Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          )
        )}
      </Swiper>
    </>
  );
};

export default Course_Slider;
