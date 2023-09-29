// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAT0rz4OmKYcTt-plIUocPerY-aHg1vBrg",
  authDomain: "shoppingify-d979f.firebaseapp.com",
  projectId: "shoppingify-d979f",
  storageBucket: "shoppingify-d979f.appspot.com",
  messagingSenderId: "1046144722031",
  appId: "1:1046144722031:web:f903c72df889e93214199a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);