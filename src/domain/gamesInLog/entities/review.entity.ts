import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Optional } from '@/core/types/optional';

export interface ReviewProps {
  ownerId: UniqueEntityId;
  gameInLogId: UniqueEntityId;
  rating: number;
  content: string;

  createdAt: Date;
  updatedAt?: Date | null;
}

export class Review extends Entity<ReviewProps> {
  get ownerId() { return this.props.ownerId; }

  get gameInLogId() { return this.props.gameInLogId; }

  get content() { return this.props.content; }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  get rating() { return this.props.rating; }

  set rating(rating: number) {
    this.props.rating = rating;
    this.touch();
  }

  get createdAt() { return this.props.createdAt; }

  get updatedAt() { return this.props.updatedAt; }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<ReviewProps, 'createdAt'>, id?: UniqueEntityId) {
    const user = new Review({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id);

    return user;
  }
}
