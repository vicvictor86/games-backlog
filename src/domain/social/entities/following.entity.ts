import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Optional } from '@/core/types/optional';

export interface FollowingProps {
  userAccountId: UniqueEntityId;
  userFollowingId: UniqueEntityId;

  createdAt: Date;
}

export class Following extends Entity<FollowingProps> {
  get userAccountId() { return this.props.userAccountId; }

  get userFollowingId() { return this.props.userFollowingId; }

  get createdAt() { return this.props.createdAt; }

  static create(props: Optional<FollowingProps, 'createdAt'>, id?: UniqueEntityId) {
    const gamesList = new Following({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id);

    return gamesList;
  }
}
