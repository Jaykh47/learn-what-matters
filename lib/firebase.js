// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// PASTE YOUR COPIED firebaseConfig OBJECT HERE
const firebaseConfig = {
  apiKey: "AIzaSyBtabM7YYnNeJNSPUVov8Fe-s34vmmQ6UQ",
  authDomain: "edu-platform-lwm.firebaseapp.com",
  projectId: "edu-platform-lwm",
  storageBucket: "edu-platform-lwm.firebasestorage.app",
  messagingSenderId: "139311050347",
  appId: "1:139311050347:web:a858cd0ee1ebf359ef4b2e",
  measurementId: "G-3V5JZPEZN7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you'll need
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);