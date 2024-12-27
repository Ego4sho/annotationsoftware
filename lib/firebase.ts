import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// In Replit, environment variables are accessed through process.env
const firebaseConfig = {
  apiKey: process.env.REPLIT_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.REPLIT_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REPLIT_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.REPLIT_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REPLIT_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REPLIT_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
};

console.log('Initializing Firebase with config:', {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket
});

// Initialize Firebase
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  console.log('Firebase app initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase app:', error);
  throw error;
}

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Log initialized services
console.log('Firebase services initialized:', {
  app: app.name,
  storage: storage ? 'initialized' : 'failed',
  auth: auth ? 'initialized' : 'failed'
});

export { app, db, storage, auth }; 