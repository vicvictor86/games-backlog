import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { GamesListsRepository } from '../repositories/gamesLists.repository';
import { GamesList, Visibility } from '../entities/gamesList.entity';
import { GamesListAlreadyExists } from './errors/gamesListAlreadyExists';

interface CreateGamesListUseCaseRequest {
  ownerId: string;
  name: string;
  description: string;
  visibility: Visibility;
}

type CreateGamesListUseCaseResponse = Either<ResourceNotFoundError | GamesListAlreadyExists, {
}>;

@Injectable()
export class CreateGamesListUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private gamesListRepository: GamesListsRepository,
  ) {}

  async execute({
    ownerId,
    description,
    name,
    visibility,
  }: CreateGamesListUseCaseRequest): Promise<CreateGamesListUseCaseResponse> {
    const user = await this.usersRepository.findById(ownerId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const gamesListAlreadyExists = await this.gamesListRepository.findByGamesListName(name);

    if (gamesListAlreadyExists) {
      return left(new GamesListAlreadyExists(name));
    }

    const gamesList = GamesList.create({
      ownerId: user.id,
      description,
      name,
      visibility,
    });

    await this.gamesListRepository.create(gamesList);

    return right({});
  }
}
