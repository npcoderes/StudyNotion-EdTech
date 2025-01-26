import React, { createContext, useState, useContext } from "react";

// Create Context
const SignupContext = createContext();

// Provider Component
export const SignupProvider = ({ children }) => {
  const [document, setDocument] = useState({
    firstName: "", // To store the first name
    lastName: "", // To store the last name
    email: "", // To store the email
    password: "", // To store the password
    confirmPassword: "", // To store the confirm password
    file: null, // To store the file
  });

  return (
    <SignupContext.Provider value={{ document, setDocument }}>
      {children}
    </SignupContext.Provider>
  );
};

// Custom Hook to Use Context
export const useSignup = () => useContext(SignupContext);
