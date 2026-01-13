import { IUserProfileRepository } from '../../domain/repositories/IUserProfileRepository';
import { UserProfile, UpdateProfileDTO } from '../../domain/entities/UserProfile';

const STORAGE_KEY = 'mindease_user_profile';

export class LocalStorageUserProfileRepository implements IUserProfileRepository {
  async getProfile(): Promise<UserProfile | null> {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const profile = JSON.parse(data);
    return {
      ...profile,
      createdAt: new Date(profile.createdAt),
      updatedAt: new Date(profile.updatedAt),
    };
  }

  async updateProfile(data: UpdateProfileDTO): Promise<UserProfile> {
    const existingProfile = await this.getProfile();
    
    if (!existingProfile) {
      return this.createProfile(data);
    }

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...data,
      updatedAt: new Date(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    return updatedProfile;
  }

  async createProfile(data: UpdateProfileDTO): Promise<UserProfile> {
    const newProfile: UserProfile = {
      id: crypto.randomUUID(),
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    return newProfile;
  }
}
