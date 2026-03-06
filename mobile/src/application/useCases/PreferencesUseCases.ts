import { IPreferencesRepository } from '../../domain/repositories/IPreferencesRepository';
import { UserPreferences } from '../../domain/entities/UserPreferences';

export class GetUserPreferencesUseCase {
  constructor(private repo: IPreferencesRepository) {}
  execute(userId: string): Promise<UserPreferences> { return this.repo.getPreferences(userId); }
}

export class UpdateUserPreferencesUseCase {
  constructor(private repo: IPreferencesRepository) {}
  execute(userId: string, data: Partial<UserPreferences>): Promise<UserPreferences> {
    return this.repo.updatePreferences(userId, data);
  }
}
