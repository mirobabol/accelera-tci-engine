import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import mockData from '../data/mockProspects.json';

// TODO: Replace with real Firebase config from console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mock-domain.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mock-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mock-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:0000000:web:000000"
};

// Initialize Firebase only if keys exist, otherwise mock the DB connection
let app, db, auth;
let isMockDB = true; // FORCE MOCK MODE 

try {
  if (firebaseConfig.apiKey !== "mock-key" && false) { // Skip Firebase init
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isMockDB = false;
    console.log("Firebase Connected");
  } else {
    console.warn("Using Mock Database. Awaiting Firebase Keys.");
  }
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
