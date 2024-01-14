import { DomainEvents } from '@/core/events/domainEvents';
import { ReviewReaction } from '@/domain/gamesInLog/entities/reviewReaction.entity';
import { ReviewsReactionsRepository } from '@/domain/gamesInLog/repositories/reviewsReactions.repository';

export class InMemoryReviewsReactionsRepository implements ReviewsReactionsRepository {
  public items: ReviewReaction[] = [];

  async findById(id: string): Promise<ReviewReaction | null> {
    const reviewReaction = this.items.find((item) => item.id.toString() === id);

    if (!reviewReaction) {
      return null;
    }

    return reviewReaction;
  }

  async findByReviewIdAndReactOwnerId(reviewId: string, reactOwnerId: string): Promise<ReviewReaction | null> {
    const reviewReaction = this.items.find((item) => item.reviewId.toString() === reviewId && item.reactOwnerId.toString() === reactOwnerId);

    if (!reviewReaction) {
      return null;
    }

    return reviewReaction;
  }

  async fetchManyByReviewId(reviewId: string): Promise<ReviewReaction[]> {
    const reviewReaction = this.items.filter((item) => item.reviewId.toString() === reviewId);

    return reviewReaction;
  }

  async create(reviewReaction: ReviewReaction) {
    this.items.push(reviewReaction);

    DomainEvents.dispatchEventsForAggregate(reviewReaction.id);
  }

  async save(reviewReaction: ReviewReaction) {
    const reviewReactionIndex = this.items.findIndex((item) => item.id.equals(reviewReaction.id));

    if (reviewReactionIndex < 0) {
      return;
    }

    this.items[reviewReactionIndex] = reviewReaction;

    DomainEvents.dispatchEventsForAggregate(reviewReaction.id);
  }

  async delete(reviewReaction: ReviewReaction): Promise<void> {
    const reviewReactionIndex = this.items.findIndex((item) => item.id.equals(reviewReaction.id));

    if (reviewReactionIndex < 0) {
      return;
    }

    this.items.splice(reviewReactionIndex, 1);

    DomainEvents.dispatchEventsForAggregate(reviewReaction.id);
  }
}
