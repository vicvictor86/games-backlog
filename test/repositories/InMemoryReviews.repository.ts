import { DomainEvents } from '@/core/events/domainEvents';
import { Review } from '@/domain/games/entities/review.entity';
import { ReviewsRepository } from '@/domain/games/repositories/review.repository';

export class InMemoryReviewsRepository implements ReviewsRepository {
  public items: Review[] = [];

  async findById(id: string): Promise<Review | null> {
    const review = this.items.find((item) => item.id.toString() === id);

    if (!review) {
      return null;
    }

    return review;
  }

  async findByGameInLogId(gameInLogId: string): Promise<Review | null> {
    const review = this.items.find((item) => item.gameInLog.toString() === gameInLogId);

    if (!review) {
      return null;
    }

    return review;
  }

  async fetchManyByOwnerId(ownerId: string): Promise<Review[] | null> {
    const reviews = this.items.filter((item) => item.ownerId.toString() === ownerId);

    if (!reviews) {
      return null;
    }

    return reviews;
  }

  async create(review: Review) {
    this.items.push(review);

    DomainEvents.dispatchEventsForAggregate(review.id);
  }

  async save(review: Review) {
    const reviewIndex = this.items.findIndex((item) => item.id.equals(review.id));

    if (reviewIndex < 0) {
      return;
    }

    this.items[reviewIndex] = review;

    DomainEvents.dispatchEventsForAggregate(review.id);
  }
}
