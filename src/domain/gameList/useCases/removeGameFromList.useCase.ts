import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { GamesListsRepository } from '../repositories/gamesLists.repository';
import { GamesInListsRepository } from '../repositories/gamesInLists.repository';

interface RemoveGameFromListUseCaseRequest {
  userId: string;
  gameInListId: string;
}

type RemoveGameFromListUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

@Injectable()
export class RemoveGameFromListUseCase {
  constructor(
    private gameInListsRepository: GamesInListsRepository,
    private gameListsRepository: GamesListsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    gameInListId,
    userId,
  }: RemoveGameFromListUseCaseRequest): Promise<RemoveGameFromListUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const gameInList = await this.gameInListsRepository.findById(gameInListId);

    if (!gameInList) {
      return left(new ResourceNotFoundError());
    }

    const list = await this.gameListsRepository.findById(gameInList.listId.toString());

    if (!list) {
      return left(new ResourceNotFoundError());
    }

    if (list.ownerId.toString() !== user.id.toString()) {
      return left(new NotAllowedError());
    }

    await this.gameInListsRepository.delete(gameInList);

    return right({});
  }
}
