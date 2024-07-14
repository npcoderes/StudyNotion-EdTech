import React from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast';
import logo from '../../assets/Logo/Logo-Full-Light.png'
// import Login from './../pages/Login';
// import Dashboard from './../pages/Dashboard';
const Navbar = (props) => {
 let  isLoggedIn=props.isLoggedIn
 let  setIsLoggedIn=props.setIsLoggedIn

  return (
    <>
    <div className=' flex  justify-around items-center my-1 py-4 w-11/12  mx-auto   '>
      <Link to="/">
        <img src={logo} alt=""  className='w-[200px] max-sm:w-[150px]'/>
      </Link>
      <nav className='max-sm:hidden'>
        <ul className='flex gap-4  text-lg text-pure-greys-5'> 
          <Link to={"/"}>
          <li>Home</li>
          </Link>
          <Link to={"/about"}>
          <li>About</li>
          </Link>
          <Link to={"/contactus"}>
          <li>Contact</li>
          </Link>
       
        
        </ul>
      </nav>
      <div>
        {  !isLoggedIn &&
          <Link to="/login" >
            <button className='py-2 px-4 mx-2 bg-[#FFD60A] text-black  rounded-md hover:scale-90 transition-all  hover:font-medium' >Login</button>
          </Link>
        }
        {
          !isLoggedIn &&
          <Link to="/register">
            <button className='py-2 px-4 mx-2 bg-[#FFD60A] text-black  rounded-md hover:scale-90 transition-all  hover:font-medium'>Sign Up</button>
          </Link>
        }
        {
           isLoggedIn &&
          <Link to="/" >
            <button className='py-2 px-4 mx-2 bg-[#FFD60A] text-black  rounded-md hover:scale-90 transition-all  hover:font-medium'  onClick={()=>{
              setIsLoggedIn(false)
              toast.success('Log Out Successfull')
            }}>Log Out</button>
          </Link>
        }
        {
          isLoggedIn &&
          <Link to="/dashboard">
            <button className='py-2 px-4 mx-2 bg-[#FFD60A] text-black  rounded-md hover:scale-90 transition-all  hover:font-medium'>Dashboard</button>
          </Link>
        }
      </div>
    </div>
    <div className='border-b-[2px] border-b-[#2C333F] w-[90%] mx-auto'></div>
    </>
  )
}

export default Navbar
