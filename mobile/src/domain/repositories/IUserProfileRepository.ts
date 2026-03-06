import { UserProfile, UpdateProfileDTO } from '../entities/UserProfile';

export interface IUserProfileRepository {
  getProfile(userId: string): Promise<UserProfile | null>;
  createProfile(profile: UserProfile): Promise<UserProfile>;
  updateProfile(userId: string, data: UpdateProfileDTO): Promise<UserProfile>;
}
