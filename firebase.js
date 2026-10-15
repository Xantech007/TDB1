// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFkUPTR1hCi1HYhLi7baTgKVwho4-MzMA",
  authDomain: "tdbank-8b351.firebaseapp.com",
  projectId: "tdbank-8b351",
  storageBucket: "tdbank-8b351.firebasestorage.app",
  messagingSenderId: "283447547295",
  appId: "1:283447547295:web:a838f776e4e9f4b77919aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
