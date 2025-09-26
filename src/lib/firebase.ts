import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: Replace this with your own Firebase project's configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrIchldLRg4rsPVsmSDWIDDnBbYIjdClo",
  authDomain: "personatest-c8eb1.firebaseapp.com",
  projectId: "personatest-c8eb1",
  storageBucket: "personatest-c8eb1.firebasestorage.app",
  messagingSenderId: "56769105558",
  appId: "1:56769105558:web:8e13f979f8b7541ec5fcb7"
};

// Initialize Firebase for Server-Side Rendering (SSR), prevent re-initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, firestore, auth };
