import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBP5gdqV0RhPatkFdx5VWSKE4dJrd1Ujm8",
  authDomain: "deeperedge-classification.firebaseapp.com",
  projectId: "deeperedge-classification",
  storageBucket: "deeperedge-classification.appspot.com",
  messagingSenderId: "670096166328",
  appId: "1:670096166328:web:e6b82aa1d1b69577ffd34d"
};

console.log('Initializing Firebase with config:', {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket
});

// Initialize Firebase
let app;
let db;
let storage;
let auth;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
  } else {
    app = getApp();
    console.log('Using existing Firebase app');
  }

  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);

  console.log('Firebase services initialized:', {
    app: app.name,
    db: db.type,
    auth: {
      currentUser: auth.currentUser?.email,
      isAuthenticated: !!auth.currentUser
    }
  });

  // Enable auth persistence in browser environment
  if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('Auth persistence enabled');
      })
      .catch((error) => {
        console.error('Error setting auth persistence:', error);
      });
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { app, db, storage, auth }; 