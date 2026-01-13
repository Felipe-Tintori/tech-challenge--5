import { IUserProfileRepository } from '../../domain/repositories/IUserProfileRepository';
import { UserProfile, UpdateProfileDTO } from '../../domain/entities/UserProfile';

export class UpdateUserProfileUseCase {
  constructor(private repository: IUserProfileRepository) {}

  async execute(data: UpdateProfileDTO): Promise<UserProfile> {
    return this.repository.updateProfile(data);
  }
}
