import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { compareAsc } from 'date-fns';
import { CurrentStatus, GameInLog, PlayedMedium } from '../entities/gameInLog.entity';
import { GamesInLogRepository } from '../repositories/gamesInLog.repository';
import { Review } from '../entities/review.entity';
import { ReviewsRepository } from '../repositories/review.repository';
import { InvalidDate } from './errors/invalidDate';

interface CreateGameInLogUseCaseRequest {
  ownerId: string;
  gameIGDBId: string;
  currentStatus: CurrentStatus;
  platform: string;
  startedOn: Date;
  finishedOn: Date;
  wasPlatinum: boolean;
  wasReplayed: boolean;
  playedMedium: PlayedMedium;
  timePlayed: number;

  rating: number;
  reviewContent: string;
}

type CreateGameInLogUseCaseResponse = Either<ResourceNotFoundError | InvalidDate, {
}>;

@Injectable()
export class CreateGameInLogUseCase {
  constructor(
    private gamesInLogRepository: GamesInLogRepository,
    private usersRepository: UsersRepository,
    private reviewsRepository: ReviewsRepository,
  ) {}

  async execute({
    currentStatus,
    finishedOn,
    gameIGDBId,
    ownerId,
    platform,
    playedMedium,
    startedOn,
    timePlayed,
    wasPlatinum,
    wasReplayed,
    rating,
    reviewContent,
  }: CreateGameInLogUseCaseRequest): Promise<CreateGameInLogUseCaseResponse> {
    const user = await this.usersRepository.findById(ownerId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const dateIsValid = compareAsc(startedOn, finishedOn) === -1;

    if (!dateIsValid) {
      return left(new InvalidDate());
    }

    const game = GameInLog.create({
      currentStatus,
      finishedOn,
      gameIGDBId,
      ownerId: user.id,
      platform,
      playedMedium,
      startedOn,
      timePlayed,
      wasPlatinum,
      wasReplayed,
    });

    await this.gamesInLogRepository.create(game);

    const review = Review.create({
      ownerId: user.id,
      gameInLog: game.id,
      content: reviewContent,
      rating,
    });

    await this.reviewsRepository.create(review);

    return right({});
  }
}
