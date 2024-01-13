import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { SearchGameByIdUseCase } from '@/apis/igdb/useCases/searchGameById.useCase';
import { GamesInLogRepository } from '../repositories/gamesInLog.repository';
import { GameInLog } from '../entities/gameInLog.entity';

interface FetchGamesInLogByUserUseCaseRequest {
  ownerId: string;
  page: number;
  returnPerPage: number;
}

type FetchGamesInLogByUserUseCaseResponse = Either<ResourceNotFoundError, {
  gamesInfo: {
    games: GameInLog[];
    igdbGames: any[];
  };
}>;

@Injectable()
export class FetchGamesInLogByUserUseCase {
  constructor(
    private gamesInLogRepository: GamesInLogRepository,
    private usersRepository: UsersRepository,
    private searchGameById: SearchGameByIdUseCase,
  ) {}

  async execute({
    ownerId,
    page,
    returnPerPage,
  }: FetchGamesInLogByUserUseCaseRequest): Promise<FetchGamesInLogByUserUseCaseResponse> {
    const user = await this.usersRepository.findById(ownerId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const games = await this.gamesInLogRepository.fetchManyByOwnerId(ownerId, { page, returnPerPage });

    const igdbGamesPromise = games.map(async (game) => this.searchGameById.execute({ igdbId: game.gameIGDBId }));

    const igdbGames = await Promise.all(igdbGamesPromise);

    return right({ gamesInfo: { igdbGames: igdbGames.map((igdbGame) => igdbGame.value), games } });
  }
}
