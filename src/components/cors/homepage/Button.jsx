import React from "react"
import { Link } from "react-router-dom"

const HButton = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <div
        className={`text-center text-[13px] sm:text-[16px] px-6 py-3 rounded-md font-bold  ${
          active ? "bg-[#422faf] text-white" : "bg-white text-black border border-[#422faf]"
        } hover:scale-95 transition-all duration-200`}
      >
        {children}
      </div>
    </Link>
  )
}

export default HButton