import React, { useState, useEffect } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "./../../data/navbar-links";
import { Link, useLocation } from "react-router-dom";
import { matchPath } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileDropDown from "../Auth/ProfileDropDown";
import { AiOutlineShoppingCart, AiOutlineMenu } from "react-icons/ai";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";

const Navbar = () => {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const [ssubLinks, setSsubLinks] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      setSsubLinks(result.data.data);
    } catch (error) {
      console.log("Could not fetch the category list");
    }
  };

  useEffect(() => {
    fetchSublinks();
  }, []);

  return (
    <div className="bg-richblack-900 border-b-[1px] border-richblack-700 py-3">
      <div className="w-11/12 max-w-maxContent mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="" className="max-h-8 max-w-[180px]" />
          </Link>

          {/* Navigation links for desktop */}
          <nav className="hidden lg:block">
            <ul className="flex gap-6 text-richblack-25 text-base font-medium">
              {NavbarLinks.map((nav, index) => (
                <li key={index} className="cursor-pointer">
                  {nav.title === "Catalog" ? (
                    <div className="flex items-center gap-1 relative group cursor-pointer">
                      <p>{nav.title}</p>
                      <div className="lg:w-[300px] flex flex-col bg-richblack-800 text-richblack-25 p-4 rounded-md gap-3 absolute top-[100%] left-1/2 transform -translate-x-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 z-10">
                        {ssubLinks.map((link, index) => (
                          <Link key={index} to={`/catalog/${link.name}`}>
                            <span className="hover:text-yellow-50 transition-colors duration-200">{link.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link to={nav.path}>
                      <span
                        className={`${
                          matchRoute(nav?.path)
                            ? "text-yellow-50 border-b-2 border-yellow-50 pb-1"
                            : "text-richblack-25 hover:text-yellow-50 transition-colors duration-200"
                        }`}
                      >
                        {nav.title}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User actions */}
          <div className="flex items-center gap-4">
            {user && user?.accountType !== "Instructor" && (
              <Link to="/dashboard/cart" className="relative">
                <AiOutlineShoppingCart className="text-2xl text-richblack-25 hover:text-yellow-50 transition-colors duration-200" />
                {totalItems > 0 && (
                  <span className="text-xs bg-yellow-50 text-richblack-900 rounded-full w-5 h-5 absolute -top-2 -right-2 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            {token == null ? (
              <div className="hidden lg:flex gap-4">
                <Link to="/login">
                  <button className="border border-richblack-700 bg-richblack-800 px-4 py-2 text-richblack-25 rounded-md hover:bg-richblack-700 transition-colors duration-200">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="border border-richblack-700 bg-yellow-50 px-4 py-2 text-richblack-900 rounded-md hover:bg-yellow-25 transition-colors duration-200">
                    Sign Up
                  </button>
                </Link>
              </div>
            ) : (
              <div className="hidden lg:block">
                <ProfileDropDown NavbarLinks={NavbarLinks} ssubLinks={ssubLinks} />
              </div>
            )}


            {/* Mobile menu button */}
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <AiOutlineMenu className="text-2xl text-richblack-25" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 bg-richblack-800 rounded-md shadow-md p-4">
            {token == null ? (
              <div className="flex flex-col gap-4">
                <Link to="/login">
                  <button className="w-full border border-richblack-700 bg-richblack-800 px-4 py-2 text-richblack-25 rounded-md hover:bg-richblack-700 transition-colors duration-200">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="w-full border border-richblack-700 bg-yellow-50 px-4 py-2 text-richblack-900 rounded-md hover:bg-yellow-25 transition-colors duration-200">
                    Sign Up
                  </button>
                </Link>
              </div>
            ) : (
              <ProfileDropDown NavbarLinks={NavbarLinks} ssubLinks={ssubLinks} isMobile={true} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;