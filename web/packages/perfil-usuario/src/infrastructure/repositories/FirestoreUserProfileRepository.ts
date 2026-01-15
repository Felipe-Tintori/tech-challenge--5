import { IUserProfileRepository } from '../../domain/repositories/IUserProfileRepository';
import { UserProfile, UpdateProfileDTO } from '../../domain/entities/UserProfile';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirestoreDb } from '../config/firebase';
import { getAuth } from 'firebase/auth';

const COLLECTION_NAME = 'user_profiles';

export class FirestoreUserProfileRepository implements IUserProfileRepository {
  private db = getFirestoreDb();

  private getUserId(): string {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    return userId;
  }

  async getProfile(): Promise<UserProfile | null> {
    try {
      const userId = this.getUserId();
      const docRef = doc(this.db, COLLECTION_NAME, userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;

      return this.convertToUserProfile({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  async updateProfile(data: UpdateProfileDTO): Promise<UserProfile> {
    console.log('updateProfile called with:', data);
    const existingProfile = await this.getProfile();
    console.log('existingProfile:', existingProfile);
    
    if (!existingProfile) {
      console.log('No existing profile, creating new one');
      return this.createProfile(data);
    }

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...data,
      updatedAt: new Date(),
    };

    try {
      const userId = this.getUserId();
      console.log('Updating profile for userId:', userId);
      const docRef = doc(this.db, COLLECTION_NAME, userId);
      
      // Remove undefined values
      const cleanProfile = this.removeUndefined(updatedProfile);
      await setDoc(docRef, cleanProfile);
      console.log('Profile updated successfully');
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async createProfile(data: UpdateProfileDTO): Promise<UserProfile> {
    const userId = this.getUserId();
    console.log('createProfile called for userId:', userId, 'with data:', data);
    const newProfile: UserProfile = {
      id: userId,
      name: data.name || '',
      email: data.email || '',
      avatar: data.avatar,
      bio: data.bio,
      neurodivergence: data.neurodivergence || [],
      specificNeeds: data.specificNeeds || [],
      studyRoutine: data.studyRoutine,
      workRoutine: data.workRoutine,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const docRef = doc(this.db, COLLECTION_NAME, userId);
      
      // Remove undefined values
      const cleanProfile = this.removeUndefined(newProfile);
      await setDoc(docRef, cleanProfile);
      console.log('Profile created successfully in Firestore');
      return newProfile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  private removeUndefined(obj: any): any {
    const cleaned: any = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined) {
        cleaned[key] = obj[key];
      }
    });
    return cleaned;
  }

  private convertToUserProfile(data: any): UserProfile {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      bio: data.bio,
      neurodivergence: data.neurodivergence || [],
      specificNeeds: data.specificNeeds || [],
      studyRoutine: data.studyRoutine,
      workRoutine: data.workRoutine,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
    };
  }
}
