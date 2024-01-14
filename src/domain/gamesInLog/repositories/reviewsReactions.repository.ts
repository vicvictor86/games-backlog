import { ReviewReaction } from '../entities/reviewReaction.entity';

export abstract class ReviewsReactionsRepository {
  abstract findById(id: string): Promise<ReviewReaction | null>;
  abstract findByReviewIdAndReactOwnerId(reviewId: string, reactOwnerId: string): Promise<ReviewReaction | null>;
  abstract fetchManyByReviewId(reviewId: string): Promise<ReviewReaction[]>;
  abstract create(reviewReaction: ReviewReaction): Promise<void>;
  abstract save(reviewReaction: ReviewReaction): Promise<void>;
  abstract delete(reviewReaction: ReviewReaction): Promise<void>;
}
