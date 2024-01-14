import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { ReviewsRepository } from '../repositories/review.repository';
import { InvalidDate } from './errors/invalidDate';
import { Answer } from '../entities/answer.entity';
import { AnswersRepository } from '../repositories/answer.repository';

interface AnswerReviewUseCaseRequest {
  userId: string;
  reviewId: string;
  content: string;
}

type AnswerReviewUseCaseResponse = Either<ResourceNotFoundError | InvalidDate, {
}>;

@Injectable()
export class AnswerReviewUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private usersRepository: UsersRepository,
    private reviewsRepository: ReviewsRepository,
  ) {}

  async execute({
    userId,
    reviewId,
    content,
  }: AnswerReviewUseCaseRequest): Promise<AnswerReviewUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const review = await this.reviewsRepository.findById(reviewId);

    if (!review) {
      return left(new ResourceNotFoundError());
    }

    const answer = Answer.create({
      ownerId: user.id,
      reviewId: review.id,
      content,
    });

    await this.answersRepository.create(answer);

    return right({});
  }
}
