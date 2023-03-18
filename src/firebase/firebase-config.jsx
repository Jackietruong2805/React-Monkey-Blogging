// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXpgzBCKLJjVFUQeVNWhUkFh-Mdne9qxk",
  authDomain: "monkey-blogging-a0e7c.firebaseapp.com",
  projectId: "monkey-blogging-a0e7c",
  storageBucket: "monkey-blogging-a0e7c.appspot.com",
  messagingSenderId: "459842779372",
  appId: "1:459842779372:web:acc1a2d5ba9204d7008dc9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);