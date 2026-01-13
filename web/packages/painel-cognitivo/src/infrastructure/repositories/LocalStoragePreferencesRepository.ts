// Infrastructure: Local Storage Repository
import { UserPreferences } from '../../domain/entities/Preferences';
import { IPreferencesRepository } from '../../application/useCases/GetUserPreferencesUseCase';

const STORAGE_KEY = 'mindease_preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  fontSize: 'medium',
  spacing: 'normal',
  animationsEnabled: true,
  focusMode: false,
  complexityLevel: 'standard',
  highContrast: false,
};

export class LocalStoragePreferencesRepository implements IPreferencesRepository {
  async getPreferences(): Promise<UserPreferences> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
      return DEFAULT_PREFERENCES;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }
}
