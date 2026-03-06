import { doc, getDoc, setDoc, Firestore } from 'firebase/firestore';
import { IPreferencesRepository } from '../../domain/repositories/IPreferencesRepository';
import { UserPreferences, DEFAULT_PREFERENCES } from '../../domain/entities/UserPreferences';

export class FirestorePreferencesRepository implements IPreferencesRepository {
  constructor(private db: Firestore) {}

  async getPreferences(userId: string): Promise<UserPreferences> {
    const snap = await getDoc(doc(this.db, 'user_preferences', userId));
    if (!snap.exists()) {
      return { userId, ...DEFAULT_PREFERENCES };
    }
    return snap.data() as UserPreferences;
  }

  async updatePreferences(userId: string, data: Partial<UserPreferences>): Promise<UserPreferences> {
    const current = await this.getPreferences(userId);
    const updated: UserPreferences = {
      ...current,
      ...data,
      userId,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(this.db, 'user_preferences', userId), updated, { merge: true });
    return updated;
  }
}
