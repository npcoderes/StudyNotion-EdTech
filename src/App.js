import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from './pages/Login';
import Signup from "./pages/Signup";
import OpenRoute from "./components/Auth/OpenRoute";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPass from "./pages/ForgotPass";
import UpdatePassword from "./pages/Update-pass";
import About from "./pages/About";

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      {/* Navbar  */}
      <Navbar />
      <Routes>
        
        <Route path="/" element={ <Home />  } />
        <Route path="/about" element={ <About />  } />
        <Route path="/login" element={<OpenRoute><Login /></OpenRoute>} />
        <Route path="/signup" element={<OpenRoute><Signup /></OpenRoute>} />
        <Route path="/verify-email" element={<OpenRoute> <VerifyEmail /> </OpenRoute>} />
        <Route path="/forgot-password" element={<OpenRoute> <ForgotPass /> </OpenRoute>} />
        <Route path="/update-password/:id" element={<OpenRoute> <UpdatePassword /> </OpenRoute>} />
        
      </Routes>

    </div>
  );
}

export default App;
