import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCVCz0ozmSkFIlesqxXV6C726ESPMiq7e8",
  authDomain: "techchallenger5.firebaseapp.com",
  projectId: "techchallenger5",
  storageBucket: "techchallenger5.firebasestorage.app",
  messagingSenderId: "21739282725",
  appId: "1:21739282725:web:38a19fe9ab167705a2facc"
};

let app: FirebaseApp;
let db: Firestore;

export const initializeFirebase = (): void => {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
};

export const getFirestoreDb = (): Firestore => {
  if (!db) {
    initializeFirebase();
  }
  return db;
};
