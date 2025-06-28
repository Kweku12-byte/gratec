// This file connects our React app to your Firebase project.

// Import the functions we need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration, with the corrected storageBucket
const firebaseConfig = {
  apiKey: "AIzaSyBLRtjmUq9nYqU1954u-PZmIIxj4fL4L-U",
  authDomain: "gratec-course.firebaseapp.com",
  projectId: "gratec-course",
  storageBucket: "gratec-course.firebasestorage.app", // Using your original, correct value
  messagingSenderId: "201341294309",
  appId: "1:201341294309:web:cabfcd43e95fecf4c7e60c",
  measurementId: "G-MMNY6SEJPB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services and export them for use in other files
export const auth = getAuth(app); 
export const db = getFirestore(app); 
const analytics = getAnalytics(app);

// Export the main app as a default export
export default app;