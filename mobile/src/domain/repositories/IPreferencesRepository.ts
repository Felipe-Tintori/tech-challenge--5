import { UserPreferences } from '../entities/UserPreferences';

export interface IPreferencesRepository {
  getPreferences(userId: string): Promise<UserPreferences>;
  updatePreferences(userId: string, data: Partial<UserPreferences>): Promise<UserPreferences>;
}
