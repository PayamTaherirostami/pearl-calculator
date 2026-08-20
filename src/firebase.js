import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIRE_API_KEY,
  authDomain: "birthdays-ad70f.firebaseapp.com",
  projectId: "birthdays-ad70f",
  storageBucket: "birthdays-ad70f.firebasestorage.app",
  messagingSenderId: "886228852557",
  appId: process.env.REACT_APP_FIRE_ID,
  measurementId: "G-4FV23ZW754"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

console.log("🔥 Firebase initialized");
console.log("🔥 Project ID:", process.env.REACT_APP_FIRE_ID);