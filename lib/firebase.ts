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

// Initialize Firebase with error handling
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let analytics: any = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Initialize Analytics (only in browser)
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

export { auth, db, storage, analytics };
export default app;
