import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// The user will replace these environment variables in Netlify / .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDvy1RFjRjjTzTYViLmGXrp2tPB3C1AV2k",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "accelera-tci-150fc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "accelera-tci-150fc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "accelera-tci-150fc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "686306636383",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:686306636383:web:6ea3b4d45bbdcb2658a1ea"
};

let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase Initialized Successfully.");
} catch (e) {
  console.error("Firebase Initialization Failed (Using Stubs). Ensure .env variables are set.", e);
}

export { auth, db };
