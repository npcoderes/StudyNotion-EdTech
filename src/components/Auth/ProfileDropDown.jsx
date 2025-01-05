import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut, VscAccount } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

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
        className="flex items-center gap-x-2 rounded-full bg-richblack-800 py-2 px-4 text-richblack-25 
        transition-all duration-200 hover:bg-richblack-700 hover:shadow-lg"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-x-2">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[30px] rounded-full object-cover ring-2 "
          />
          <span className="hidden md:inline">{user?.firstName}</span>
        </div>
        <AiOutlineCaretDown 
          className={`text-sm transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`} 
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-[120%] w-[250px] rounded-xl border border-richblack-700 
            bg-richblack-800 backdrop-blur-sm"
          >
            {/* User Info Section */}
            <div className="border-b border-richblack-700 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={user?.image}
                  alt={user?.firstName}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-semibold text-richblack-5">
                    {user?.firstName} {user?.lastName}
                  </h4>
                  <p className="text-xs text-richblack-25">{user?.email}</p>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-block rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-richblack-900">
                  {user?.accountType}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col p-2">
              <Link 
                to="/dashboard/my-profile" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-x-2 rounded-lg py-2 px-3 text-sm text-richblack-25 
                hover:bg-richblack-700 hover:text-yellow-50 transition-all duration-200"
              >
                <VscDashboard className="text-lg" />
                Dashboard
              </Link>
              
              <Link 
                to="/dashboard/settings" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-x-2 rounded-lg py-2 px-3 text-sm text-richblack-25 
                hover:bg-richblack-700 hover:text-yellow-50 transition-all duration-200"
              >
                <VscAccount className="text-lg" />
                Settings
              </Link>

              <button
                onClick={() => {
                  dispatch(logout(navigate))
                  setOpen(false)
                }}
                className="flex items-center gap-x-2 rounded-lg py-2 px-3 text-sm text-pink-500 
                hover:bg-pink-500/10 transition-all duration-200"
              >
                <VscSignOut className="text-lg" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}