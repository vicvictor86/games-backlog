import { DomainEvents } from '@/core/events/domainEvents';
import { PaginationParams } from '@/core/repositories/paginationParams';
import { Following } from '@/domain/social/entities/following.entity';
import { FollowingsRepository } from '@/domain/social/repositories/followings.repository';

export class InMemoryFollowingsRepository implements FollowingsRepository {
  public items: Following[] = [];

  async findById(id: string): Promise<Following | null> {
    const following = this.items.find((item) => item.id.toString() === id);

    if (!following) {
      return null;
    }

    return following;
  }

  async findByUserAccountId(userAccountId: string, params: PaginationParams): Promise<Following[]> {
    const followings = this.items
      .filter((item) => item.userAccountId.toString() === userAccountId)
      .slice((params.page - 1) * params.returnPerPage, params.page * params.returnPerPage);

    return followings;
  }

  async findFollowing(userAccountId: string, userFollowingId: string): Promise<Following> {
    const following = this.items.find((item) => item.userAccountId.toString() === userAccountId && item.userFollowingId.toString() === userFollowingId);

    if (!following) {
      throw new Error('Following not found');
    }

    return following;
  }

  async create(following: Following) {
    this.items.push(following);

    DomainEvents.dispatchEventsForAggregate(following.id);
  }

  async delete(following: Following): Promise<void> {
    const followingIndex = this.items.findIndex((item) => item.id.equals(following.id));

    if (followingIndex < 0) {
      return;
    }

    this.items.splice(followingIndex, 1);
  }
}
