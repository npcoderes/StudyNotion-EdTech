import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import useOnClickOutside from "../../hooks/useOnClickOutside"
import { logout } from "../../services/operations/authAPI"

export default function ProfileDropDown() {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))

  if (!user) return null

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-x-1 py-2 px-3 rounded-md hover:bg-richblack-700 transition-all duration-200"
        onClick={() => setOpen(!open)}
      >
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        <AiOutlineCaretDown className={`text-sm text-richblack-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-[120%] mt-1 w-[200px] rounded-md border border-richblack-700 bg-richblack-800 shadow-lg z-[1000] overflow-hidden">
          <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-x-1 py-2 px-3 text-richblack-5 hover:bg-richblack-700 hover:text-yellow-50 transition-all duration-200">
              <VscDashboard className="text-lg" />
              Dashboard
            </div>
          </Link>
          <div
            onClick={() => {
              dispatch(logout(navigate))
              setOpen(false)
            }}
            className="flex items-center gap-x-1 py-2 px-3 text-richblack-5 hover:bg-richblack-700 hover:text-yellow-50 transition-all duration-200 cursor-pointer"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </div>
  )
}