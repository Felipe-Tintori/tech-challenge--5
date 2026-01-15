import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { getFirestoreDb } from '../config/firebase';
import { getFirebaseAuth } from '../config/firebase';

const COLLECTION_NAME = 'app_storage';

// Helper to get user-specific document ID
const getUserDocId = (key: string): string => {
  const auth = getFirebaseAuth();
  const userId = auth.currentUser?.uid || 'anonymous';
  return `${userId}_${key}`;
};

export const storage = {
  get: async (key: string): Promise<string | null> => {
    try {
      const db = getFirestoreDb();
      const docRef = doc(db, COLLECTION_NAME, getUserDocId(key));
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data().value;
      }
      return null;
    } catch (error) {
      console.error('Error getting from storage:', error);
      return null;
    }
  },

  set: async (key: string, value: string): Promise<void> => {
    try {
      const db = getFirestoreDb();
      const docRef = doc(db, COLLECTION_NAME, getUserDocId(key));
      await setDoc(docRef, {
        value,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error setting storage:', error);
    }
  },

  remove: async (key: string): Promise<void> => {
    try {
      const db = getFirestoreDb();
      const docRef = doc(db, COLLECTION_NAME, getUserDocId(key));
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },

  clear: async (): Promise<void> => {
    console.warn('Clear all storage not implemented for Firestore');
    // Note: Clearing all documents would require fetching all user documents
    // This is intentionally not implemented for safety
  },
};
