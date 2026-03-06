import { doc, getDoc, setDoc, Firestore } from 'firebase/firestore';
import { IUserProfileRepository } from '../../domain/repositories/IUserProfileRepository';
import { UserProfile, UpdateProfileDTO } from '../../domain/entities/UserProfile';

export class FirestoreUserProfileRepository implements IUserProfileRepository {
  constructor(private db: Firestore) {}

  async getProfile(userId: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(this.db, 'users', userId));
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  }

  async createProfile(profile: UserProfile): Promise<UserProfile> {
    await setDoc(doc(this.db, 'users', profile.id), profile, { merge: true });
    return profile;
  }

  async updateProfile(userId: string, data: UpdateProfileDTO): Promise<UserProfile> {
    const current = await this.getProfile(userId);
    const now = new Date().toISOString();
    const merged: UserProfile = {
      ...(current || { id: userId, name: '', email: '', neurodivergence: [], specificNeeds: [], createdAt: now }),
      ...data,
      updatedAt: now,
    };
    // Remove undefined values — Firestore rejects them
    const clean = JSON.parse(JSON.stringify(merged));
    await setDoc(doc(this.db, 'users', userId), clean, { merge: true });
    return clean as UserProfile;
  }
}
