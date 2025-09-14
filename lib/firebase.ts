// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxsAZYxELSg0dwUvsON820fOaRmJi6zas",
  authDomain: "selling-website-digital.firebaseapp.com",
  projectId: "selling-website-digital",
  storageBucket: "selling-website-digital.firebasestorage.app",
  messagingSenderId: "857075190348",
  appId: "1:857075190348:web:c703382c845c94378c82e9",
  measurementId: "G-2E4HG0Q9RD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
