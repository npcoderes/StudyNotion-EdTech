import { useRef, useState, useEffect } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import useOnClickOutside from "../../hooks/useOnClickOutside"
import { logout } from "../../services/operations/authAPI"
import { MdMenuOpen } from "react-icons/md"

export default function MobileProfileDropDown({ NavbarLinks = [], ssubLinks = [] }) {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [subLinks, setSubLinks] = useState([])
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))

  useEffect(() => {
    if (ssubLinks && ssubLinks.length > 0) {
      setSubLinks(ssubLinks)
    }
  }, [ssubLinks])

  const handleLogout = () => {
    setLoading(true)
    dispatch(logout(navigate))
    setLoading(false)
  }

  return (
    <div className="relative z-[1000]" ref={ref}>
      <button
        className="flex items-center gap-x-1 py-2 px-3 rounded-md  transition-all duration-200"
        onClick={() => setOpen(!open)}
      >
        {user ? (
          <>
            <img
              src={user?.image}
              alt={`profile-${user?.firstName}`}
              className="aspect-square w-[30px] rounded-full object-cover"
            />
            <AiOutlineCaretDown className={`text-sm text-mytext transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </>
        ) : (
          <>
           <MdMenuOpen className="text-2xl" />  <AiOutlineCaretDown className={`text-sm text-richblack-900 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />

          </>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-[120%] mt-1 w-[250px] rounded-md  bg-black shadow-lg z-[1000] overflow-hidden ">
          <div className="max-h-[calc(100vh-80px)] overflow-y-auto py-2">
            {NavbarLinks && NavbarLinks.map((link, index) => (
              <div key={index} className="px-2 py-1">
                {link.title === "Catalog" ? (
                  <div className="rounded-md bg-richblack-800">
                    <p className="font-semibold text-richblack-25 px-3 py-2 border-b border-richblack-700">{link.title}</p>
                    {subLinks.map((subLink, subIndex) => (
                      <Link
                        key={subIndex}
                        to={`/catalog/${subLink.name}`}
                        className="block py-2 px-3 text-richblack-100  transition-all duration-200"
                        onClick={() => setOpen(false)}
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className="block py-2 px-3 text-richblack-25 transition-all duration-200 rounded-md bg-richblack-800"
                    onClick={() => setOpen(false)}
                  >
                    {link.title}
                  </Link>
                )}
              </div>
            ))}
            {user ? (
              <>
                <hr className="my-2 border-richblack-700" />
                <div className="px-2 py-1">
                  <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
                    <div className="flex items-center gap-x-1 py-2 px-3 text-richblack-25  transition-all duration-200 rounded-md bg-richblack-800">
                      <VscDashboard className="text-lg" />
                      Dashboard
                    </div>
                  </Link>
                </div>
                <div className="px-2 py-1">
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex w-full items-center gap-x-1 py-2 px-3 text-richblack-25 transition-all duration-200 rounded-md bg-richblack-800 cursor-pointer"
                  >
                    <VscSignOut className="text-lg" />
                    {loading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-2 py-1">
                  <Link
                    to="/login"
                    className="block py-2 px-3 text-richblack-25 transition-all duration-200 rounded-md bg-richblack-800"
                    onClick={() => setOpen(false)}
                  >
                    Log in
                  </Link>
                </div>
                <div className="px-2 py-1">
                  <Link
                    to="/signup"
                    className="block py-2 px-3 text-richblack-25 transition-all duration-200 rounded-md bg-richblack-800"
                    onClick={() => setOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}