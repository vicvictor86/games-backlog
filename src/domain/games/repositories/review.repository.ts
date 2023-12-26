import { Review } from '../entities/review.entity';

export abstract class ReviewsRepository {
  abstract findById(id: string): Promise<Review | null>;
  abstract fetchManyByOwnerId(ownerId: string): Promise<Review[] | null>;
  abstract findByGameInLogId(gameInLogId: string): Promise<Review | null>;
  abstract create(review: Review): Promise<void>;
  abstract save(review: Review): Promise<void>;
}
