import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { AnswersReactionsRepository } from '../repositories/reviewsReactions.repository copy';

interface RemoveReactAnswerUseCaseRequest {
  userId: string;
  answerReactionId: string;
}

type RemoveReactAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
}>;

@Injectable()
export class RemoveReactAnswerUseCase {
  constructor(
    private answersReactionsRepository: AnswersReactionsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    answerReactionId,
  }: RemoveReactAnswerUseCaseRequest): Promise<RemoveReactAnswerUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const answerReaction = await this.answersReactionsRepository.findById(answerReactionId);

    if (!answerReaction) {
      return left(new ResourceNotFoundError());
    }

    if (!answerReaction.reactOwnerId.equals(user.id)) {
      return left(new NotAllowedError());
    }

    await this.answersReactionsRepository.delete(answerReaction);

    return right({});
  }
}
