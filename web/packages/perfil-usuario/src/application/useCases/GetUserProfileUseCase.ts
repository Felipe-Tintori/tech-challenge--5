import { IUserProfileRepository } from '../../domain/repositories/IUserProfileRepository';
import { UserProfile } from '../../domain/entities/UserProfile';

export class GetUserProfileUseCase {
  constructor(private repository: IUserProfileRepository) {}

  async execute(): Promise<UserProfile | null> {
    return this.repository.getProfile();
  }
}
