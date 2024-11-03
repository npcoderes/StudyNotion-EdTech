import React, { useEffect, useState } from "react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import Card from "./Card"

const Course_Slider = ({Courses}) => {
  return (
    <>
    <Swiper
      slidesPerView={1}
      spaceBetween={25}
      loop={false}
      modules={[Pagination,Navigation]}
      className="mySwiper"
      // autoplay={{
      // delay: 1000,
      // disableOnInteraction: false,
      // }}
      navigation={true}
      breakpoints={{
        1024: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 2,
        },
        480: {
          slidesPerView: 1,
        },
      }}
    //   className="max-h-[30rem] pt-8 px-2"
    >
        {<div className="flex gap-x-5 sm:flex-col">{
                    Courses.map((course,i)=>(
                      <SwiperSlide key={i}>
                      <Card course={course} Height={"h-[250px]"} />
                    </SwiperSlide>
                  ))
          }

        </div>

        }
    </Swiper>
    </>
  )
}

export default Course_Slider