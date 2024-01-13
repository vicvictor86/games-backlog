import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { GamesListsRepository } from '../repositories/gamesLists.repository';
import { GamesList } from '../entities/gamesList.entity';

interface FetchGamesListsByUserUseCaseRequest {
  ownerId: string;
  page: number;
  returnPerPage: number;
}

type FetchGamesListsByUserUseCaseResponse = Either<ResourceNotFoundError, {
  gamesLists: GamesList[];
}>;

@Injectable()
export class FetchGamesListsByUserUseCase {
  constructor(
    private gamesListsRepository: GamesListsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    ownerId,
    page,
    returnPerPage,
  }: FetchGamesListsByUserUseCaseRequest): Promise<FetchGamesListsByUserUseCaseResponse> {
    const user = await this.usersRepository.findById(ownerId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const gamesLists = await this.gamesListsRepository.findByOwnerId(ownerId, { page, returnPerPage });

    return right({ gamesLists });
  }
}
