import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { SearchGameByIdUseCase } from '@/apis/igdb/useCases/searchGameById.useCase';
import { GamesInLogRepository } from '../repositories/gamesInLog.repository';
import { GameInLogWithIGDBInfoAndReview } from '../entities/ValueObjects/gameInLogWithIGDBInfoAndReview';
import { ReviewsRepository } from '../repositories/review.repository';

interface FindGameInLogUseCaseRequest {
  gameInLogId: string;
}

type FindGameInLogUseCaseResponse = Either<ResourceNotFoundError, {
  game: GameInLogWithIGDBInfoAndReview;
}>;

@Injectable()
export class FindGameInLogUseCase {
  constructor(
    private gamesInLogRepository: GamesInLogRepository,
    private searchGameByIdUseCase: SearchGameByIdUseCase,
    private reviewsRepository: ReviewsRepository,
  ) {}

  async execute({
    gameInLogId,
  }: FindGameInLogUseCaseRequest): Promise<FindGameInLogUseCaseResponse> {
    const game = await this.gamesInLogRepository.findById(gameInLogId);

    if (!game) {
      return left(new ResourceNotFoundError());
    }

    const review = await this.reviewsRepository.findByGameInLogId(game.id.toString());

    if (!review) {
      return left(new ResourceNotFoundError());
    }

    const gameIGDB = await this.searchGameByIdUseCase.execute({
      igdbId: game.gameIGDBId,
    });

    if (gameIGDB.isLeft()) {
      return left(new ResourceNotFoundError());
    }

    return right({ game: GameInLogWithIGDBInfoAndReview.create({ gameInLog: game, gameIGDB: gameIGDB.value.gameInfo, review }) });
  }
}
