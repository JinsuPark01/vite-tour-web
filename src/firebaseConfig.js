// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7VMAufZb3tFi7_WlhBVN2eMrSwhOA0eA",
  authDomain: "sample1-4c53d.firebaseapp.com",
  projectId: "sample1-4c53d",
  storageBucket: "sample1-4c53d.firebasestorage.app",
  messagingSenderId: "304210485511",
  appId: "1:304210485511:web:e6f9329b9c0ad93bdce5a2",
  measurementId: "G-HS1TWGPX6F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;