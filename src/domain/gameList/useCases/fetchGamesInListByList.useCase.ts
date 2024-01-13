import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { GamesListsRepository } from '../repositories/gamesLists.repository';
import { GameInList } from '../entities/gameInList.entity';
import { GamesInListsRepository } from '../repositories/gamesInLists.repository';

interface FetchGamesInListByListUseCaseRequest {
  ownerId: string;
  listId: string;
  page: number;
  returnPerPage: number;
}

type FetchGamesInListByListUseCaseResponse = Either<ResourceNotFoundError, {
  gamesInList: GameInList[];
}>;

@Injectable()
export class FetchGamesInListByListUseCase {
  constructor(
    private gamesListsRepository: GamesListsRepository,
    private gamesInListRepository: GamesInListsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    ownerId,
    listId,
    page,
    returnPerPage,
  }: FetchGamesInListByListUseCaseRequest): Promise<FetchGamesInListByListUseCaseResponse> {
    const user = await this.usersRepository.findById(ownerId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const list = await this.gamesListsRepository.findById(listId);

    if (!list) {
      return left(new ResourceNotFoundError());
    }

    if (list.visibility === 'PRIVATE' && list.ownerId.toString() !== user.id.toString()) {
      return left(new ResourceNotFoundError());
    }

    // if (list.visibility === 'FRIENDS_ONLY') { } TODO: Implement friends only visibility

    const gamesInList = await this.gamesInListRepository.findByListId(listId, { page, returnPerPage });

    return right({ gamesInList });
  }
}
