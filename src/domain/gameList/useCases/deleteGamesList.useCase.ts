import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { GamesListsRepository } from '../repositories/gamesLists.repository';

interface DeleteGamesListUseCaseRequest {
  userId: string;
  gamesListId: string;
}

type DeleteGamesListUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

@Injectable()
export class DeleteGamesListUseCase {
  constructor(
    private gamesListsRepository: GamesListsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    gamesListId,
    userId,
  }: DeleteGamesListUseCaseRequest): Promise<DeleteGamesListUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const gamesList = await this.gamesListsRepository.findById(gamesListId);

    if (!gamesList) {
      return left(new ResourceNotFoundError());
    }

    if (gamesList.ownerId.toString() !== user.id.toString()) {
      return left(new NotAllowedError());
    }

    await this.gamesListsRepository.delete(gamesList);

    return right({});
  }
}
