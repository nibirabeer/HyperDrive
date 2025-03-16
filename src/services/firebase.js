import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBXwNkZ9tSVAF_kmBxhFidlI3jewGEVmc",
  authDomain: "hyperdrive-5fd9f.firebaseapp.com",
  projectId: "hyperdrive-5fd9f",
  storageBucket: "hyperdrive-5fd9f.firebasestorage.app",
  messagingSenderId: "342097598023",
  appId: "1:342097598023:web:ecb95ecff5db595e8b0362",
  measurementId: "G-CFGS21K6DD"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
