import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { ReviewsRepository } from '../repositories/review.repository';
import { ReviewsReactionsRepository } from '../repositories/reviewsReactions.repository';
import { ReviewReaction, ReviewReactionsType } from '../entities/reviewReaction.entity';

interface ReactReviewUseCaseRequest {
  userId: string;
  reviewId: string;
  reviewReactionType: ReviewReactionsType;
}

type ReactReviewUseCaseResponse = Either<ResourceNotFoundError, {
}>;

@Injectable()
export class ReactReviewUseCase {
  constructor(
    private reviewsReactionsRepository: ReviewsReactionsRepository,
    private usersRepository: UsersRepository,
    private reviewsRepository: ReviewsRepository,
  ) {}

  async execute({
    reviewReactionType,
    reviewId,
    userId,
  }: ReactReviewUseCaseRequest): Promise<ReactReviewUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const review = await this.reviewsRepository.findById(reviewId);

    if (!review) {
      return left(new ResourceNotFoundError());
    }

    const reviewReactionAlreadyExists = await this.reviewsReactionsRepository.findByReviewIdAndReactOwnerId(reviewId, userId);

    if (reviewReactionAlreadyExists) {
      reviewReactionAlreadyExists.reviewReaction = reviewReactionType;

      await this.reviewsReactionsRepository.save(reviewReactionAlreadyExists);

      return right({});
    }

    const reviewReaction = ReviewReaction.create({
      reviewReaction: reviewReactionType,
      reactOwnerId: user.id,
      reviewId: review.id,
    });

    await this.reviewsReactionsRepository.create(reviewReaction);

    return right({});
  }
}
