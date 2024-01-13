import { DomainEvents } from '@/core/events/domainEvents';
import { PaginationParams } from '@/core/repositories/paginationParams';
import { Followed } from '@/domain/social/entities/followed.entity';
import { FollowersRepository } from '@/domain/social/repositories/followers.repository';

export class InMemoryFollowersRepository implements FollowersRepository {
  public items: Followed[] = [];

  async findById(id: string): Promise<Followed | null> {
    const followed = this.items.find((item) => item.id.toString() === id);

    if (!followed) {
      return null;
    }

    return followed;
  }

  async findByUserAccountId(userAccountId: string, params: PaginationParams): Promise<Followed[]> {
    const followers = this.items
      .filter((item) => item.userAccountId.toString() === userAccountId)
      .slice((params.page - 1) * params.returnPerPage, params.page * params.returnPerPage);

    return followers;
  }

  async findFollower(userAccountId: string, userFollowedId: string): Promise<Followed> {
    const follower = this.items.find((item) => item.userAccountId.toString() === userAccountId && item.userFollowedId.toString() === userFollowedId);

    if (!follower) {
      throw new Error('Follower not found');
    }

    return follower;
  }

  async create(followed: Followed) {
    this.items.push(followed);

    DomainEvents.dispatchEventsForAggregate(followed.id);
  }

  async delete(followed: Followed): Promise<void> {
    const followedIndex = this.items.findIndex((item) => item.id.equals(followed.id));

    if (followedIndex < 0) {
      return;
    }

    this.items.splice(followedIndex, 1);
  }
}
