import React from 'react'
import HighlightText from './HighlightText'
import { useState } from 'react';
import CourseCard from './CourseCard';
import { HomePageExplore } from './../../../data/homepage-explore';

const ExploreSection = () => {
    const tabsName = [
        "Free",
        "New to coding",
        "Most popular",
        "Skill paths",
        "Career paths",
    ];
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(courses[0].heading);
    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }
  return (
    <div className=''>
        <div className='text-4xl max-sm:text-2xl font-semibold text-center'>
        Unlock the <HighlightText text={"Power of Code"}> </HighlightText>
        </div>
        <div className='text-center text-richblack-300 mt-3 text-sm text-[16px] max-sm:text-xs'>
        Learn to Build Anything You Can Imagine
        </div>
        <div className='mt-5 flex flex-row rounded-full bg-richblack-800 mb-5 border-richblack-100 flex-wrap max-sm:max-w-96 justify-center items-center
      px-1 py-1'>
      {
        tabsName.map( (element, index) => {
            return (
                <div
                className={`text-[16px] flex flex-row items-center gap-2  max-sm:text-xs
                ${currentTab === element 
                ? "bg-richblack-900 text-richblack-5 font-medium"
                : "text-richblack-200" } rounded-full transition-all duration-200 cursor-pointer
                hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                key={index}
                onClick={() => setMyCards(element)}
                >
                    {element}
                </div>
            )
        })
      }
      </div>
        <div className='lg:h-[150px]'></div>
        <div className='flex gap-10 w-full  lg:absolute lg:-bottom-32 lg:left-20 flex-row max-sm:flex-col items-center'>
            {
                courses.map((course,index)=>{
                    return(
                        <CourseCard 
                        key={index}
                        cardData = {course}
                        currentCard = {currentCard}
                        setCurrentCard = {setCurrentCard}
                        />
                    )
                })
            }
        </div>
      
    </div>
  )
}

export default ExploreSection
