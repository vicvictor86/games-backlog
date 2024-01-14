import { Answer } from '../entities/answer.entity';

export abstract class AnswersRepository {
  abstract findById(id: string): Promise<Answer | null>;
  abstract fetchManyByOwnerId(ownerId: string): Promise<Answer[]>;
  abstract fetchManyReviewId(reviewId: string): Promise<Answer[]>;
  abstract create(answer: Answer): Promise<void>;
  abstract save(answer: Answer): Promise<void>;
  abstract delete(answer: Answer): Promise<void>;
}
