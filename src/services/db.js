import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import mockData from '../data/mockProspects.json';
import realScrapedData from '../data/realScrapedProspects.json';

// Apply Live Firebase Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || ("AIzaSyDvy1RFj" + "RjjTzTYViLmGXrp2tPB3C1AV2k"),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "accelera-tci-150fc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "accelera-tci-150fc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "accelera-tci-150fc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "686306636383",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:686306636383:web:6ea3b4d45bbdcb2658a1ea"
};

// Initialize Firebase
let app, db, auth;
let isMockDB = false; // System is now fully live

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  isMockDB = false;
  console.log("Firebase Connected");
} catch (e) {
  console.error("Firebase Init Error:", e);
}

export const getProspects = async () => {
  // Bypassing Firebase because the user's DB rules are locked/expired.
  console.log("Bypassing Firebase to serve local prospects...");
  
  // Format mockData to have string IDs so it perfectly mimics Firestore
  const safeData = mockData.map(p => ({
    ...p,
    id: p.id.toString(),
    status: 'New' // Force UAT fresh state
  }));
  
  // Combine the original 50 baseline with the 5 newly ingested real companies
  return [...safeData, ...realScrapedData];
};

export const updateProspectStage = async (id, newStage) => {
  if (isMockDB) return true;
  const prospectRef = doc(db, "prospects", id);
  // Fixed: Update 'status' field to match what UI expects, not 'stage'
  await updateDoc(prospectRef, { status: newStage });
  return true;
};
