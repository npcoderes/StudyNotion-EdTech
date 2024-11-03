import "./App.css";


import Navbar from "./components/common/Navbar";

import AnimatedRoutes from "./components/common/AnimatedRoutes";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setToken } from "./slices/authSlice";

function App() {
 const {token} = useSelector(state=>state.auth)
 const dispatch = useDispatch()
 const tokenData = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;

 const expirationTime = tokenData ? tokenData.expirationTime : null; // This will now correctly retrieve the expiration time
 console.log(expirationTime)
 const currentTime = new Date().getTime()
 if(currentTime > expirationTime && token){
    localStorage.removeItem("token")
    toast.error("Session Expired, Please Login Again 🤖")
    dispatch(setToken(null))

    window.location.reload();
 }
  return (
    <div className="w-screen min-h-screen bg-white flex flex-col font-inter">
      {/* Navbar  */}
      <Navbar />
      <AnimatedRoutes />

    </div>
  );
}

export default App;
