import React from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";

import { NavbarLinks } from "./../../data/navbar-links";
import { Link, useLocation } from "react-router-dom";
import { matchPath } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileDropDown from "../Auth/ProfileDropDown";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useState } from "react";
import {apiConnector }from "../../services/apiconnector"
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useEffect } from "react";
import {categories} from "../../services/apis"
import {profileEndpoints} from "../../services/apis"

const Navbar = () => {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const {totalItems}=useSelector((state) => state.cart);
  const matchRoute = (route) => {
    try {
      return matchPath({ path: route }, location.pathname);
    } catch (err) {
      console.log(err);
    }
  };
  const [ssubLinks, setSsubLinks]  = useState([]);
  const fetchSublinks = async() => {
    try{
        const result = await apiConnector("GET", categories.CATEGORIES_API);
        console.log("Printing Sublinks result:" , result);
        setSsubLinks(result.data.data);
        console.log("Sublinks",ssubLinks)
       
    }
    catch(error) {
        console.log("Could not fetch the category list");
    }
}


useEffect( () => {
    fetchSublinks();
    // const fetchUserData = async () => {
    //   try {
    //     const response = await apiConnector("GET", profileEndpoints.GET_USER_DETAILS_API, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //     const userData = response.data;
    //     console.log("User Data", userData);
    //     // Process the user data here
    //   } catch (error) {
    //     console.error("Failed to fetch user data", error.message);
    //     if (error.response) {
    //       // The request was made and the server responded with a status code
    //       // that falls out of the range of 2xx
    //       console.error("Error Response", error.response.data);
    //       console.error("Error Status", error.response.status);
    //       console.error("Error Headers", error.response.headers);
    //     } else if (error.request) {
    //       // The request was made but no response was received
    //       console.error("Error Request", error.request);
    //     } else {
    //       // Something happened in setting up the request that triggered an Error
    //       console.error("Error Message", error.message);
    //     }
    //   }
    // };

    
    //   fetchUserData();
   
},[] )





  return (
    <div className="bg-richblack-900 border-b-[1px] border-richblack-600 h-14 flex items-center py-2">
      <div className="w-11/12 max-w-maxContent mx-auto flex justify-between  items-center gap-4 ">
        {/* Logo  */}
        <div>
          <img src={logo} alt="" className="max-h-8 max-w-[180px]" />
        </div>

        {/* Navigation links  */}
        <nav>
          <ul className="flex gap-4 text-richblack-5 text-base font-semibold">
            {NavbarLinks.map((nav, index) => (
              (nav.title==="Catalog") ?(<div className="flex items-center  gap-1 relative group">
                
                  <p>{nav.title}
                  </p>
                  <IoIosArrowDropdownCircle/>
               
                  <div className="lg:w-[300px] flex flex-col bg-richblack-5 text-richblack-900 p-4 rounded-md gap-3 absolute translate-x-[-50%] translate-y-[80%] invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-500 z-10 ">
                  <div className="w-6 h-6 absolute bg-richblack-5 -top-3 translate-x-[85%] rotate-45 left-[60%]"></div>
                    
                    {
                       ssubLinks.map((link,index)=>{
                         return(
                          <Link key={index} to={`/catalog/${link.name}`}>
                            <li>{link.name}</li>
                          </Link>
                         )
                       })
                    }
                  </div>
                
              </div>):(
              <Link to={nav.path}>
                <li
                  key={index}
                  className={`${
                    matchRoute(nav?.path)
                      ? "text-yellow-25 border-b-[1px]"
                      : "text-richblack-25"
                  }`}
                >
                  {nav.title}
                </li>
              </Link>)
            ))}
          </ul>
        </nav>

        {/* login- signup-dashboard  */}
        <div className="text-richblack-50 flex gap-x-4 items-center text-sm ">
          {token == null && (
            <Link to="/login">
              <div className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Login
              </div>
            </Link>
          )}
          {token == null && (
            <Link to="/signup">
              <div className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                signup
              </div>
            </Link>
          )}
          {user  && user?.accountType !== "Instructor" && (
                    <Link to="/dashboard/cart" className='relative'>
                    <AiOutlineShoppingCart  className="text-2xl"/>
                    {
                        totalItems > 0 && (
                            <span className="text-xs bg-white rounded-full w-4 h-4  absolute -top-1 right-0 flex items-center justify-center text-richblack-800  moveup">
                                {totalItems} 
                            </span>
                        )
                    }
                </Link>
          )}
          {token !== null && <ProfileDropDown />}
          {
            console.log(token)
            
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;
