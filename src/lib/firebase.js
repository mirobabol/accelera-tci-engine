import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// The user will replace these environment variables in Netlify / .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "stub_api_key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "stub_auth_domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "stub_project_id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "stub_storage_bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "stub_sender_id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "stub_app_id"
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
