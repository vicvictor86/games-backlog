import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { AnswersRepository } from '../repositories/answer.repository';
import { AnswerReaction, AnswerReactionsType } from '../entities/answerReaction.entity';
import { AnswersReactionsRepository } from '../repositories/reviewsReactions.repository copy';

interface ReactAnswerUseCaseRequest {
  userId: string;
  answerId: string;
  answerReactionType: AnswerReactionsType;
}

type ReactAnswerUseCaseResponse = Either<ResourceNotFoundError, {
}>;

@Injectable()
export class ReactAnswerUseCase {
  constructor(
    private answersReactionsRepository: AnswersReactionsRepository,
    private usersRepository: UsersRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    answerReactionType,
    answerId,
    userId,
  }: ReactAnswerUseCaseRequest): Promise<ReactAnswerUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const answerReactionAlreadyExists = await this.answersReactionsRepository.findByAnswerIdAndReactOwnerId(answerId, userId);

    if (answerReactionAlreadyExists) {
      answerReactionAlreadyExists.answerReaction = answerReactionType;

      await this.answersReactionsRepository.save(answerReactionAlreadyExists);

      return right({});
    }

    const answerReaction = AnswerReaction.create({
      answerReaction: answerReactionType,
      reactOwnerId: user.id,
      answerId: answer.id,
    });

    await this.answersReactionsRepository.create(answerReaction);

    return right({});
  }
}
