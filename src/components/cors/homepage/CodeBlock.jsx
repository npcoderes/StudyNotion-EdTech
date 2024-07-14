import React from 'react'

import CTAButton from './Button'
import { TypeAnimation } from 'react-type-animation';

import { FaArrowRight } from "react-icons/fa";

const CodeBlock = ({position,heading,subheading,ctabtn1,ctabtn2,codeblock,backgroundgradint,codecolor}) => {
  return (
    <div className={`flex ${position} my-20 max-sm:my-10 justify-between gap-10 codeblock`}>
      {/* section-1  */}
      <div className='w-[50%] flex flex-col mt-7 max-sm:w-full'>
          {heading}
          <div className='text-richblack-300 m'>
            {subheading}
          </div>
         <div className='flex gap-7 mt-14'>
         <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                <div className='flex gap-2 items-center'>
                    {ctabtn1.btnText}
                    <FaArrowRight/>
                </div>
            </CTAButton>

            <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>  
                    {ctabtn2.btnText}
            </CTAButton>
         </div>
      </div>

      {/* section-2  */}
      <div className='h-fit flex  py-4 w-[100%]  lg:w-[500px] max-sm:w-[320px] relative ' >
        <div className={`${backgroundgradint} blur-[80px] w-1/3 absolute h-3/4  left-20 translate-x-6 rotate-90 top-11   `}></div>
      <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold '>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
            <p>11</p>
        </div>

        <div className={`w-[90%] flex flex-col gap-2 font-bold max-sm:text-sm font-mono ${codecolor} pr-2 backdrop-blur-2xl `}>
           <TypeAnimation
            sequence={[codeblock, 2000, ""]}
            repeat={Infinity}
            cursor={true}
           
            style = {
                {
                    whiteSpace: "pre-line",
                    display:"block",
                }
            }
            omitDeletionAnimation={true}
           />
        </div>

      </div>

    </div>
  )
}

export default CodeBlock
