// Use Case: Update User Preferences
import { UserPreferences } from '../../domain/entities/Preferences';
import { IPreferencesRepository } from './GetUserPreferencesUseCase';

export class UpdateUserPreferencesUseCase {
  constructor(private preferencesRepository: IPreferencesRepository) {}

  async execute(preferences: Partial<UserPreferences>): Promise<void> {
    const currentPreferences = await this.preferencesRepository.getPreferences();
    const updatedPreferences = { ...currentPreferences, ...preferences };
    await this.preferencesRepository.savePreferences(updatedPreferences);
  }
}
