import { UserProfile, UpdateProfileDTO } from '../entities/UserProfile';

export interface IUserProfileRepository {
  getProfile(): Promise<UserProfile | null>;
  updateProfile(data: UpdateProfileDTO): Promise<UserProfile>;
  createProfile(data: UpdateProfileDTO): Promise<UserProfile>;
}
