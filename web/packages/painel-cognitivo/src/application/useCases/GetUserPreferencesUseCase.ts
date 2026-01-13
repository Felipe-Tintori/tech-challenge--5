// Use Case: Get User Preferences
import { UserPreferences } from '../../domain/entities/Preferences';

export interface IPreferencesRepository {
  getPreferences(): Promise<UserPreferences>;
  savePreferences(preferences: UserPreferences): Promise<void>;
}

export class GetUserPreferencesUseCase {
  constructor(private preferencesRepository: IPreferencesRepository) {}

  async execute(): Promise<UserPreferences> {
    return await this.preferencesRepository.getPreferences();
  }
}
