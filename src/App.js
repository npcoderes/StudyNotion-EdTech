import "./App.css";


import Navbar from "./components/common/Navbar";

import AnimatedRoutes from "./components/common/AnimatedRoutes";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function App() {
 const {token} = useSelector(state=>state.auth)
 const expirationTime = localStorage.getItem("token")?.expirationTime
 const currentTime = new Date().getTime()
 if(currentTime > expirationTime && token){
    localStorage.removeItem("token")
    toast.error("Session Expired, Please Login Again 🤖")
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
