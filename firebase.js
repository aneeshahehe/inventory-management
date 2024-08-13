// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkCssJ3LPTZ03WKFkFw0lO-YxTLpQcqfQ",
  authDomain: "inventory-management-150c7.firebaseapp.com",
  projectId: "inventory-management-150c7",
  storageBucket: "inventory-management-150c7.appspot.com",
  messagingSenderId: "689296705384",
  appId: "1:689296705384:web:edbf38addf3efe028bf8dd",
  measurementId: "G-FN6XGKDQ75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const firestore = getFirestore(app);
export {firestore};