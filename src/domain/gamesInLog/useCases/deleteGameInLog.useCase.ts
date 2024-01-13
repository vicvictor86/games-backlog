import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { GamesInLogRepository } from '../repositories/gamesInLog.repository';
import { ReviewsRepository } from '../repositories/review.repository';

interface DeleteGameInLogUseCaseRequest {
  userId: string;

  gameInLogId: string;
}

type DeleteGameInLogUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

@Injectable()
export class DeleteGameInLogUseCase {
  constructor(
    private gamesInLogRepository: GamesInLogRepository,
    private usersRepository: UsersRepository,
    private reviewsRepository: ReviewsRepository,
  ) {}

  async execute({
    gameInLogId,
    userId,
  }: DeleteGameInLogUseCaseRequest): Promise<DeleteGameInLogUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const gameInLog = await this.gamesInLogRepository.findById(gameInLogId);

    if (!gameInLog) {
      return left(new ResourceNotFoundError());
    }

    if (gameInLog.ownerId.toString() !== user.id.toString()) {
      return left(new NotAllowedError());
    }

    const review = await this.reviewsRepository.findByGameInLogId(gameInLogId);

    if (!review) {
      return left(new ResourceNotFoundError());
    }

    await this.gamesInLogRepository.delete(gameInLog);

    await this.reviewsRepository.delete(review);

    return right({});
  }
}
