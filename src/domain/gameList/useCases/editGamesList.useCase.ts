import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { GamesListsRepository } from '../repositories/gamesLists.repository';

interface EditGamesListUseCaseRequest {
  ownerId: string;
  gamesListId: string;
  name?: string;
  description?: string;
}

type EditGamesListUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
}>;

@Injectable()
export class EditGamesListUseCase {
  constructor(
    private gamesListsRepository: GamesListsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    ownerId,
    gamesListId,
    description,
    name,
  }: EditGamesListUseCaseRequest): Promise<EditGamesListUseCaseResponse> {
    const user = await this.usersRepository.findById(ownerId);

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

    gamesList.name = name || gamesList.name;
    gamesList.description = description || gamesList.description;

    await this.gamesListsRepository.save(gamesList);

    return right({});
  }
}
