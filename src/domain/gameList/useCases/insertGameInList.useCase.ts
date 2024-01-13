import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { GamesInLogRepository } from '@/domain/gamesInLog/repositories/gamesInLog.repository';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { GamesListsRepository } from '../repositories/gamesLists.repository';
import { GamesInListsRepository } from '../repositories/gamesInLists.repository';
import { GameInList } from '../entities/gameInList.entity';

interface InsertGameInListUseCaseRequest {
  ownerId: string;
  listId: string;
  gameInLogId: string;
}

type InsertGameInListUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
}>;

@Injectable()
export class InsertGameInListUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private gamesListsRepository: GamesListsRepository,
    private gamesInListsRepository: GamesInListsRepository,
    private gamesInLogsRepository: GamesInLogRepository,
  ) {}

  async execute({
    listId,
    ownerId,
    gameInLogId,
  }: InsertGameInListUseCaseRequest): Promise<InsertGameInListUseCaseResponse> {
    const user = await this.usersRepository.findById(ownerId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const list = await this.gamesListsRepository.findById(listId);

    if (!list) {
      return left(new ResourceNotFoundError());
    }

    if (list.ownerId.toString() !== user.id.toString()) {
      return left(new NotAllowedError());
    }

    const gameInLog = await this.gamesInLogsRepository.findById(gameInLogId);

    if (!gameInLog) {
      return left(new ResourceNotFoundError());
    }

    const gameInList = GameInList.create({
      gameInLogId: gameInLog.id,
      listId: list.id,
      igdbId: gameInLog.gameIGDBId,
    });

    await this.gamesInListsRepository.create(gameInList);

    return right({});
  }
}
