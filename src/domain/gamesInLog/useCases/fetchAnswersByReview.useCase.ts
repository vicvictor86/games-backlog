import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { AnswersRepository } from '../repositories/answer.repository';
import { Answer } from '../entities/answer.entity';
import { ReviewsRepository } from '../repositories/review.repository';

interface FetchAnswersByReviewCaseRequest {
  reviewId: string;
  page: number;
  returnPerPage: number;
}

type FetchAnswersByReviewCaseResponse = Either<ResourceNotFoundError, {
  answers: Answer[]
}>;

@Injectable()
export class FetchAnswersByReviewUseCase {
  constructor(
    private reviewsRepository: ReviewsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    reviewId,
    page,
    returnPerPage,
  }: FetchAnswersByReviewCaseRequest): Promise<FetchAnswersByReviewCaseResponse> {
    const review = await this.reviewsRepository.findById(reviewId);

    if (!review) {
      return left(new ResourceNotFoundError());
    }

    const answers = await this.answersRepository.fetchManyReviewId(reviewId, { page, returnPerPage });

    return right({ answers });
  }
}
