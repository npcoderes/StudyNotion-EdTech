import React, { useState, useEffect } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { NavbarLinks } from "../../data/navbar-links";
import studyNotionLogo from "../../assets/Logo/Logo-Full-Dark.png";
import Logosmall from "../../assets/Logo/Logo-Small-Dark.png";
import { fetchCourseCategories } from "./../../services/operations/courseDetailsAPI";
import logo from "../../assets/Logo/logo.png"
import ProfileDropDown from "../Auth/ProfileDropDown";
import MobileProfileDropDown from "../Auth/MobileProfileDropDown";

import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdClose, MdKeyboardArrowDown, MdOutlineMenu } from "react-icons/md";

const Navbar = () => {
  // console.log("Printing base url: ", import.meta.env.VITE_APP_BASE_URL);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  // console.log('USER data from Navbar (store) = ', user)
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSublinks = async () => {
    try {
      setLoading(true);
      const res = await fetchCourseCategories();
      // const result = await apiConnector("GET", categories.CATEGORIES_API);
      // const result = await apiConnector('GET', 'http://localhost:4000/api/v1/course/showAllCategories');
      // console.log("Printing Sublinks result:", result);
      setSubLinks(res);
    } catch (error) {
      console.log("Could not fetch the category list = ", error);
    }
    setLoading(false);
  };

  // console.log('data of store  = ', useSelector((state)=> state))

  useEffect(() => {
    fetchSublinks();
  }, []);

  // when user click Navbar link then it will hold yellow color
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  // when user scroll down , we will hide navbar , and if suddenly scroll up , we will show navbar
  const [showNavbar, setShowNavbar] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  });

  // control Navbar
  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY) setShowNavbar("hide");
      else setShowNavbar("show");
    } else setShowNavbar("top");

    setLastScrollY(window.scrollY);
  };

  const [small, setSmall] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSmall(true);
        setShowMobileMenu(true);
      } else {
        setSmall(false);
        setShowMobileMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [showMobileMenu, setShowMobileMenu] = useState(window.innerWidth < 640);

  return (
    <nav
      className={`z-[1000] flex h-16 w-full items-center justify-center border-b-[0.5px] border-b-myborder text-mytext translate-y-0 transition-all ${showNavbar} fixed top-0 left-0 right-0 bg-mybg p-2  text-sm `}
    >
      {/* <nav className={` fixed flex items-center justify-center w-full h-16 z-[10] translate-y-0 transition-all text-white ${showNavbar}`}> */}
      <div className="flex w-11/12 max-w-maxContent items-center justify-between ">
        {/* logo */}
        <Link to="/">
          <span className="flex gap-x-3 items-center "> <img src={Logosmall} alt="" /> <span className="text-xl max-sm:text-sm font-bold ">StudyNotion</span></span>
        </Link>

        {/* Nav Links - visible for only large devices*/}
        <ul className="hidden sm:flex gap-x-6 text-mytext">
          {NavbarLinks.map((link, index) => (
            <li key={index}>
              {link.title === "Catalog" ? (
                <div
                  className={`group relative flex cursor-pointer items-center gap-1 ${
                    matchRoute("/catalog/:catalogName")
                      ? "bg-[#4251f5] text-white rounded-xl p-2 px-3"
                      : "text-mytext rounded-xl p-2 px-3 font-semibold"
                  }`}
                >
                  <p>{link.title}</p>
                  <MdKeyboardArrowDown />
                  {/* drop down menu */}
                  <div
                    className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] 
                                                    flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible 
                                                    group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]"
                  >
                    <div className="absolute left-[50%] top-0 z-[100] h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                    {loading ? (
                      <p className="text-center ">Loading...</p>
                    ) : subLinks.length ? (
                      <>
                        {subLinks?.map((subLink, i) => (
                          <Link
                            to={`/catalog/${subLink.name}`}
                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                            key={i}
                          >
                            <p>{subLink.name}</p>
                          </Link>
                        ))}
                      </>
                    ) : (
                      <p className="text-center">No Courses Found</p>
                    )}
                  </div>
                </div>
              ) : (
                <Link to={link?.path}>
                  <p
                    className={`${
                      matchRoute(link?.path)
                        ? "bg-[#422faf] text-white"
                        : "text-mytext font-semibold"
                    } rounded-xl p-2 px-3 `}
                  >
                    {link.title}
                  </p>
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Login/SignUp/Dashboard */}
        <div className="flex gap-x-4 items-center">
          {user && user?.accountType === "Student" && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-[2.35rem] text-[#4251f5]  rounded-full p-2 duration-200" />
              {totalItems > 0 && (
                <span className="absolute top-0 -right-1 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-50 text-center text-xs font-bold text-[#4251f5] bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              {/* <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md focus:outline-8 outline-yellow-50'> */}
              <button
                className={`btn btn-outline btn-primary hidden lg:block rounded-full`}
              >
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button
                className={'btn btn-primary hidden lg:block rounded-full'}
              >
                Sign Up
              </button>
            </Link>
          )}

          {/* for large devices */}
          <>
            <div className="lg:block hidden justify-center items-center ">
              {token !== null && <ProfileDropDown />}
            </div>
          </>

          {/* for small devices */}
          <>
            <div className="lg:hidden block">
              
                <MobileProfileDropDown
                  NavbarLinks={NavbarLinks}
                  ssubLinks={subLinks}
                  isMobile={true}
                />
      
            </div>
          </>
        </div>
      </div>
      <>
        <div className="lg:hidden block ">


            
        
        </div>
      </>
    </nav>
  );
};

export default Navbar;
