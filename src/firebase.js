// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// You'll need to replace these with your actual Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyDIYxOLugOduYL0Tbe_0cygOZcGu7DHYUc",
  authDomain: "lifemap-87152.firebaseapp.com",
  projectId: "lifemap-87152",
  storageBucket: "lifemap-87152.firebasestorage.app",
  messagingSenderId: "1011230817542",
  appId: "1:1011230817542:web:0ed13f3f21924ab98d3287",
  measurementId: "G-XBZEVWB7K0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;