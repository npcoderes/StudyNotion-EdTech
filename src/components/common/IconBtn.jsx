import React from 'react'

const IconBtn = ({
    text,
    onclick,
    children,
    disabled,
    outline=false,
    customClasses,
    spanclass,
    type,
}) => {
  return (
    <button 
    disabled={disabled}
    onClick={onclick}
    type={type}
    className={`bg-[#422faf] py-2 px-4 rounded-lg text-[#fff] ${customClasses} text-sm flex gap-1 items-center
                sm:text-base sm:py-2.5 sm:px-5 md:text-lg md:py-3 md:px-6 hover:bg-[#422faf]/70 transition-all duration-300`}>
        {
            children ? (
                <>
                    <span className={`${spanclass} text-xs sm:text-sm md:text-base`}>
                        {text}
                    </span>
                    {children}
                </>
            ) : (text)
        }
    </button>
  )
}

export default IconBtn
