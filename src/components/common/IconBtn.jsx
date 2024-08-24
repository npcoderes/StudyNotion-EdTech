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
    className={`bg-yellow-50 py-2 px-4 rounded-lg text-black ${customClasses}  text-sm flex gap-1 items-center`}>
        {
            children ? (
                <>
                    <span className={spanclass}>
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
