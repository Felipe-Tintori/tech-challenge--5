import { IUserProfileRepository } from '../../domain/repositories/IUserProfileRepository';
import { UserProfile, UpdateProfileDTO } from '../../domain/entities/UserProfile';

export class GetUserProfileUseCase {
  constructor(private repo: IUserProfileRepository) {}
  execute(userId: string): Promise<UserProfile | null> { return this.repo.getProfile(userId); }
}

export class UpdateUserProfileUseCase {
  constructor(private repo: IUserProfileRepository) {}
  execute(userId: string, data: UpdateProfileDTO): Promise<UserProfile> {
    return this.repo.updateProfile(userId, data);
  }
}
