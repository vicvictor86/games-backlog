import { DomainEvents } from '@/core/events/domainEvents';
import { PaginationParams } from '@/core/repositories/paginationParams';
import { GameInList } from '@/domain/gameList/entities/gameInList.entity';
import { GamesInListsRepository } from '@/domain/gameList/repositories/gamesInLists.repository';

export class InMemoryGamesInListsRepository implements GamesInListsRepository {
  public items: GameInList[] = [];

  async findById(id: string): Promise<GameInList | null> {
    const gameInList = this.items.find((item) => item.id.toString() === id);

    if (!gameInList) {
      return null;
    }

    return gameInList;
  }

  async findByListId(listId: string, params: PaginationParams): Promise<GameInList[]> {
    const gamesInLists = this.items
      .filter((item) => item.listId.toString() === listId)
      .slice((params.page - 1) * params.returnPerPage, params.page * params.returnPerPage);

    return gamesInLists;
  }

  async findByGameInLog(gameInLog: string): Promise<GameInList | null> {
    const gameInList = this.items.find((item) => item.gameInLogId.toString() === gameInLog);

    if (!gameInList) {
      return null;
    }

    return gameInList;
  }

  async findByIGDBId(igdbId: string): Promise<GameInList | null> {
    const gameInList = this.items.find((item) => item.igdbId.toString() === igdbId);

    if (!gameInList) {
      return null;
    }

    return gameInList;
  }

  async create(gameInList: GameInList) {
    this.items.push(gameInList);

    DomainEvents.dispatchEventsForAggregate(gameInList.id);
  }

  async save(gameInList: GameInList) {
    const gameInListIndex = this.items.findIndex((item) => item.id.equals(gameInList.id));

    if (gameInListIndex < 0) {
      return;
    }

    this.items[gameInListIndex] = gameInList;

    DomainEvents.dispatchEventsForAggregate(gameInList.id);
  }

  async delete(gameInList: GameInList): Promise<void> {
    const gameInListIndex = this.items.findIndex((item) => item.id.equals(gameInList.id));

    if (gameInListIndex < 0) {
      return;
    }

    this.items.splice(gameInListIndex, 1);
  }
}
