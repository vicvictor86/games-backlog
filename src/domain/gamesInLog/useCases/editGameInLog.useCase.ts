import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { compareAsc } from 'date-fns';
import { CurrentStatus, PlayedMedium } from '../entities/gameInLog.entity';
import { GamesInLogRepository } from '../repositories/gamesInLog.repository';
import { ReviewsRepository } from '../repositories/review.repository';
import { InvalidDate } from './errors/invalidDate';

interface EditGameInLogUseCaseRequest {
  ownerId: string;
  gameIGDBId: string;
  currentStatus?: CurrentStatus;
  platform?: string;
  startedOn?: Date;
  finishedOn?: Date;
  wasPlatinum?: boolean;
  wasReplayed?: boolean;
  playedMedium?: PlayedMedium;
  timePlayed?: number;

  rating?: number;
  reviewContent?: string;
}

type EditGameInLogUseCaseResponse = Either<ResourceNotFoundError | InvalidDate, {
}>;

@Injectable()
export class EditGameInLogUseCase {
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
  }: EditGameInLogUseCaseRequest): Promise<EditGameInLogUseCaseResponse> {
    const user = await this.usersRepository.findById(ownerId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    if (startedOn && finishedOn) {
      const dateIsValid = compareAsc(startedOn, finishedOn) === -1;

      if (!dateIsValid) {
        return left(new InvalidDate());
      }
    }

    const game = await this.gamesInLogRepository.findByGameIGDBIdAndOwnerId(gameIGDBId, ownerId);

    if (!game) {
      return left(new ResourceNotFoundError());
    }

    game.currentStatus = currentStatus || game.currentStatus;
    game.finishedOn = finishedOn || game.finishedOn;
    game.platform = platform || game.platform;
    game.playedMedium = playedMedium || game.playedMedium;
    game.startedOn = startedOn || game.startedOn;
    game.timePlayed = timePlayed || game.timePlayed;
    game.wasPlatinum = wasPlatinum || game.wasPlatinum;
    game.wasReplayed = wasReplayed || game.wasReplayed;

    await this.gamesInLogRepository.save(game);

    const review = await this.reviewsRepository.findByGameInLogId(game.id.toString());

    if (!review) {
      return left(new ResourceNotFoundError());
    }

    review.rating = rating || review.rating;
    review.content = reviewContent || review.content;

    await this.reviewsRepository.create(review);

    return right({});
  }
}
