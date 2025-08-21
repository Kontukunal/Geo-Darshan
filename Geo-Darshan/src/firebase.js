import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDm_wBegK7fnpABKs9bQIgsSdITMaCCMgo",
  authDomain: "geo-darshan.firebaseapp.com",
  projectId: "geo-darshan",
  storageBucket: "geo-darshan.firebasestorage.app",
  messagingSenderId: "812908946253",
  appId: "1:812908946253:web:e5cf66f6b4f8485f5c4d04",
  measurementId: "G-YHH60TXVK3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
export { db };
