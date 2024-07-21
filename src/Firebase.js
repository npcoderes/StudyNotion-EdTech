// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "auth-6ae45.firebaseapp.com",
  projectId: "auth-6ae45",
  storageBucket: "auth-6ae45.appspot.com",
  messagingSenderId: "864273781811",
  appId: "1:864273781811:web:d139c224a5c7d1bf267f46",
  measurementId: "G-70094N93CV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);