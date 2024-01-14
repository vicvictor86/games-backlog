import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Optional } from '@/core/types/optional';

export type ReviewReactionsType = 'LIKE' | 'DISAGREE' | 'LOVE' | 'FUNNY';

export interface ReviewReactionProps {
  reviewId: UniqueEntityId;
  reactOwnerId: UniqueEntityId;
  reviewReaction: ReviewReactionsType;

  createdAt: Date;
}

export class ReviewReaction extends Entity<ReviewReactionProps> {
  get reviewId() { return this.props.reviewId; }

  get reactOwnerId() { return this.props.reactOwnerId; }

  get reviewReaction() { return this.props.reviewReaction; }

  set reviewReaction(reviewReaction: ReviewReactionsType) {
    this.props.reviewReaction = reviewReaction;
    this.touch();
  }

  get createdAt() { return this.props.createdAt; }

  private touch() {
    this.props.createdAt = new Date();
  }

  static create(props: Optional<ReviewReactionProps, 'createdAt'>, id?: UniqueEntityId) {
    const user = new ReviewReaction({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id);

    return user;
  }
}
