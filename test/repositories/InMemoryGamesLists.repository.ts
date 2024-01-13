import { DomainEvents } from '@/core/events/domainEvents';
import { PaginationParams } from '@/core/repositories/paginationParams';
import { GamesList } from '@/domain/gameList/entities/gamesList.entity';
import { GamesListsRepository } from '@/domain/gameList/repositories/gamesLists.repository';

export class InMemoryGamesListsRepository implements GamesListsRepository {
  public items: GamesList[] = [];

  async findById(id: string): Promise<GamesList | null> {
    const gamesList = this.items.find((item) => item.id.toString() === id);

    if (!gamesList) {
      return null;
    }

    return gamesList;
  }

  async findByOwnerId(ownerId: string, { page, returnPerPage }: PaginationParams): Promise<GamesList[]> {
    const gamesLists = this.items
      .filter((item) => item.ownerId.toString() === ownerId)
      .slice((page - 1) * returnPerPage, page * returnPerPage);

    return gamesLists;
  }

  async findByGamesListName(gamesListName: string): Promise<GamesList | null> {
    const gamesList = this.items.find((item) => item.name === gamesListName);

    if (!gamesList) {
      return null;
    }

    return gamesList;
  }

  async create(gamesList: GamesList) {
    this.items.push(gamesList);

    DomainEvents.dispatchEventsForAggregate(gamesList.id);
  }

  async save(gamesList: GamesList) {
    const gamesListIndex = this.items.findIndex((item) => item.id.equals(gamesList.id));

    if (gamesListIndex < 0) {
      return;
    }

    this.items[gamesListIndex] = gamesList;

    DomainEvents.dispatchEventsForAggregate(gamesList.id);
  }

  async delete(gamesList: GamesList): Promise<void> {
    const gamesListIndex = this.items.findIndex((item) => item.id.equals(gamesList.id));

    if (gamesListIndex < 0) {
      return;
    }

    this.items.splice(gamesListIndex, 1);
  }
}
