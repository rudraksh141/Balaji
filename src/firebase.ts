// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqTwm5Ky6SDfJ57K8-efgZLl16qI5cQ_g",
  authDomain: "balaji-95ef5.firebaseapp.com",
  projectId: "balaji-95ef5",
  storageBucket: "balaji-95ef5.firebasestorage.app",
  messagingSenderId: "540435774687",
  appId: "1:540435774687:web:1ba7c946de46da0942fd6a",
  measurementId: "G-G8HH2HP9P0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
