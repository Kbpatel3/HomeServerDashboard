import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBviPSPKkEEmtt5ufe-miNHjLieoJsL8CQ",
  authDomain: "techstacksdashboard.firebaseapp.com",
  projectId: "techstacksdashboard",
  storageBucket: "techstacksdashboard.firebasestorage.app",
  messagingSenderId: "456260298034",
  appId: "1:456260298034:web:3f7d7c952c46448ca9632b",
  measurementId: "G-F5QC6C1VN8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
