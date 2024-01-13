import { PaginationParams } from '@/core/repositories/paginationParams';
import { Followed } from '../entities/followed.entity';

export abstract class FollowersRepository {
  abstract findById(id: string): Promise<Followed | null>;
  abstract findByUserAccountId(userAccountId: string, params: PaginationParams): Promise<Followed[]>;
  abstract findFollower(userAccountId: string, userFollowedId: string): Promise<Followed>;
  abstract create(followed: Followed): Promise<void>;
  abstract delete(followed: Followed): Promise<void>;
}
