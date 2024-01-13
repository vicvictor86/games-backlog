import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Optional } from '@/core/types/optional';

export interface FollowedProps {
  userAccountId: UniqueEntityId;
  userFollowedId: UniqueEntityId;

  createdAt: Date;
}

export class Followed extends Entity<FollowedProps> {
  get userAccountId() { return this.props.userAccountId; }

  get userFollowedId() { return this.props.userFollowedId; }

  get createdAt() { return this.props.createdAt; }

  static create(props: Optional<FollowedProps, 'createdAt'>, id?: UniqueEntityId) {
    const gamesList = new Followed({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id);

    return gamesList;
  }
}
