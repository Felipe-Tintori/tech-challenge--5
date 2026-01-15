import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { getFirestoreDb } from '../config/firebase';

export interface FirestoreDocumentData {
  [key: string]: any;
}

export class FirestoreService {
  private db = getFirestoreDb();

  /**
   * Get a document by ID from a collection
   */
  async getDocument<T>(collectionName: string, documentId: string): Promise<T | null> {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get all documents from a collection
   */
  async getDocuments<T>(collectionName: string): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(this.db, collectionName));
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as T));
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Query documents with a where clause
   */
  async queryDocuments<T>(
    collectionName: string, 
    field: string, 
    operator: any, 
    value: any
  ): Promise<T[]> {
    try {
      const q = query(collection(this.db, collectionName), where(field, operator, value));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as T));
    } catch (error) {
      console.error(`Error querying documents from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Set a document (create or replace)
   */
  async setDocument<T extends FirestoreDocumentData>(
    collectionName: string, 
    documentId: string, 
    data: T
  ): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      await setDoc(docRef, this.convertDatesToTimestamps(data));
    } catch (error) {
      console.error(`Error setting document in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update a document (partial update)
   */
  async updateDocument<T extends FirestoreDocumentData>(
    collectionName: string, 
    documentId: string, 
    data: Partial<T>
  ): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      await updateDoc(docRef, this.convertDatesToTimestamps(data));
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(collectionName: string, documentId: string): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Convert Date objects to Firestore Timestamps
   */
  private convertDatesToTimestamps(data: any): any {
    const converted: any = {};
    
    for (const key in data) {
      if (data[key] instanceof Date) {
        converted[key] = Timestamp.fromDate(data[key]);
      } else if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
        converted[key] = this.convertDatesToTimestamps(data[key]);
      } else {
        converted[key] = data[key];
      }
    }
    
    return converted;
  }

  /**
   * Convert Firestore Timestamps to Date objects
   */
  convertTimestampsToDates<T>(data: any): T {
    const converted: any = {};
    
    for (const key in data) {
      if (data[key] && typeof data[key].toDate === 'function') {
        converted[key] = data[key].toDate();
      } else if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
        converted[key] = this.convertTimestampsToDates(data[key]);
      } else {
        converted[key] = data[key];
      }
    }
    
    return converted as T;
  }
}

// Singleton instance
export const firestoreService = new FirestoreService();
