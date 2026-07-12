import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import mockData from '../data/mockProspects.json';

// Apply Live Firebase Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDvy1RFjRjjTzTYViLmGXrp2tPB3C1AV2k",
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
  if (isMockDB) {
    console.warn("Using mock JSON. Database keys missing.");
    return mockData;
  }
  
  try {
    let querySnapshot = await getDocs(collection(db, "prospects"));
    
    // Auto-seed if empty
    if (querySnapshot.empty) {
      console.log("Firestore empty. Seeding from mockData...");
      for (const prospect of mockData) {
        await setDoc(doc(db, "prospects", prospect.id.toString()), prospect);
      }
      querySnapshot = await getDocs(collection(db, "prospects"));
    }
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firestore Error:", error);
    return mockData; // fallback
  }
};

export const updateProspectStage = async (id, newStage) => {
  if (isMockDB) return true;
  const prospectRef = doc(db, "prospects", id);
  await updateDoc(prospectRef, { stage: newStage });
  return true;
};
