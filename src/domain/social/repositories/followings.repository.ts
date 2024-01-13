import { PaginationParams } from '@/core/repositories/paginationParams';
import { Following } from '../entities/following.entity';

export abstract class FollowingsRepository {
  abstract findById(id: string): Promise<Following | null>;
  abstract findByUserAccountId(userAccountId: string, params: PaginationParams): Promise<Following[]>;
  abstract findFollowing(userAccountId: string, userFollowingId: string): Promise<Following>;
  abstract create(following: Following): Promise<void>;
  abstract delete(following: Following): Promise<void>;
}
