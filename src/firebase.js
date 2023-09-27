// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsOGEtf415MrgLEqVX6tOc5qkyhcy3JO4",
  authDomain: "react-realstate-firebase.firebaseapp.com",
  projectId: "react-realstate-firebase",
  storageBucket: "react-realstate-firebase.appspot.com",
  messagingSenderId: "435175084104",
  appId: "1:435175084104:web:40482eba566264f8b4487d"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();