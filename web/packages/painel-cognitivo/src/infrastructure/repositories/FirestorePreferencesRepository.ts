import { UserPreferences } from '../../domain/entities/Preferences';
import { IPreferencesRepository } from '../../application/useCases/GetUserPreferencesUseCase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirestoreDb } from '../config/firebase';
import { getAuth } from 'firebase/auth';

const COLLECTION_NAME = 'user_preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  fontSize: 'medium',
  spacing: 'normal',
  animationsEnabled: true,
  focusMode: false,
  complexityLevel: 'standard',
  highContrast: false,
};

export class FirestorePreferencesRepository implements IPreferencesRepository {
  private db = getFirestoreDb();

  private getUserId(): string {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    return userId;
  }

  async getPreferences(): Promise<UserPreferences> {
    try {
      const userId = this.getUserId();
      const docRef = doc(this.db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { ...DEFAULT_PREFERENCES, ...docSnap.data() } as UserPreferences;
      }
      return DEFAULT_PREFERENCES;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      const userId = this.getUserId();
      const docRef = doc(this.db, COLLECTION_NAME, userId);
      await setDoc(docRef, preferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }
}
