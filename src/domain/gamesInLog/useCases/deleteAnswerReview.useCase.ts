import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { AnswersRepository } from '../repositories/answer.repository';

interface DeleteAnswerReviewUseCaseRequest {
  userId: string;

  answerReviewId: string;
}

type DeleteAnswerReviewUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

@Injectable()
export class DeleteAnswerReviewUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    answerReviewId,
    userId,
  }: DeleteAnswerReviewUseCaseRequest): Promise<DeleteAnswerReviewUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const answerReview = await this.answersRepository.findById(answerReviewId);

    if (!answerReview) {
      return left(new ResourceNotFoundError());
    }

    if (answerReview.ownerId.toString() !== user.id.toString()) {
      return left(new NotAllowedError());
    }

    await this.answersRepository.delete(answerReview);

    return right({});
  }
}
