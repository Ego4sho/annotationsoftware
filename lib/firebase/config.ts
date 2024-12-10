import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Log config for debugging (without exposing sensitive values)
console.log('Firebase config status:', {
  apiKey: !!firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: !!firebaseConfig.messagingSenderId,
  appId: !!firebaseConfig.appId
});

if (!firebaseConfig.apiKey) {
  console.error('Firebase API key is missing. Please check your environment variables.');
  console.log('Available environment variables:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));
}

// Initialize Firebase
let app;
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else {
    app = getApp();
    console.log('Using existing Firebase app');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  console.error('Firebase config:', {
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket
  });
  throw error;
}

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Enable auth persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Auth persistence enabled');
  })
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

export { app, db, storage, auth }; 