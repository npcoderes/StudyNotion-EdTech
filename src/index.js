import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from "react-redux";
import rootReducer from "./reducer";
import { Toaster } from "react-hot-toast";
import { ReactLenis, useLenis } from 'lenis/react'
import { Analytics } from "@vercel/analytics/react";
import { SignupProvider } from "./context/SignupContext";

const store = configureStore({
  reducer: rootReducer,

})


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ReactLenis root>
    <BrowserRouter>
      <Provider store={store}>
        <SignupProvider>
          <App />
        </SignupProvider>
        <Toaster />
      </Provider>
      <Analytics />
    </BrowserRouter>
  </ReactLenis>

);
