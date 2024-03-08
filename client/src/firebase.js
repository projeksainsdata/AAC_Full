// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "jaringan-odha-berdaya.firebaseapp.com",
  projectId: "jaringan-odha-berdaya",
  storageBucket: "jaringan-odha-berdaya.appspot.com",
  messagingSenderId: "995629862549",
  appId: "1:995629862549:web:0ab307929017e1c622159c",
  measurementId: "G-E90RGMJ5ZS"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
