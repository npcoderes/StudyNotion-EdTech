import "./App.css";


import Navbar from "./components/common/Navbar";

import AnimatedRoutes from "./components/common/AnimatedRoutes";

function App() {

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      {/* Navbar  */}
      <Navbar />
      <AnimatedRoutes />

    </div>
  );
}

export default App;
