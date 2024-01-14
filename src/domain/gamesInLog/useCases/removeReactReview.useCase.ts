import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { ReviewsReactionsRepository } from '../repositories/reviewsReactions.repository';

interface RemoveReactReviewUseCaseRequest {
  userId: string;
  reviewReactionId: string;
}

type RemoveReactReviewUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
}>;

@Injectable()
export class RemoveReactReviewUseCase {
  constructor(
    private reviewsReactionsRepository: ReviewsReactionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    reviewReactionId,
  }: RemoveReactReviewUseCaseRequest): Promise<RemoveReactReviewUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const reviewReaction = await this.reviewsReactionsRepository.findById(reviewReactionId);

    if (!reviewReaction) {
      return left(new ResourceNotFoundError());
    }

    if (!reviewReaction.reactOwnerId.equals(user.id)) {
      return left(new NotAllowedError());
    }

    await this.reviewsReactionsRepository.delete(reviewReaction);

    return right({});
  }
}
