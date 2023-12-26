import { DomainEvents } from '@/core/events/domainEvents';
import { GameInLog } from '@/domain/games/entities/gameInLog.entity';
import { GamesInLogRepository } from '@/domain/games/repositories/gamesInLog.repository';

export class InMemoryGamesInLogRepository implements GamesInLogRepository {
  public items: GameInLog[] = [];

  async findById(id: string): Promise<GameInLog | null> {
    const gameInLog = this.items.find((item) => item.id.toString() === id);

    if (!gameInLog) {
      return null;
    }

    return gameInLog;
  }

  async findByGameIGDBId(gameIGDBId: string): Promise<GameInLog | null> {
    const gameInLog = this.items.find((item) => item.gameIGDBId === gameIGDBId);

    if (!gameInLog) {
      return null;
    }

    return gameInLog;
  }

  async fetchManyByOwnerId(ownerId: string): Promise<GameInLog[] | null> {
    const gameInLogs = this.items.filter((item) => item.ownerId.toString() === ownerId);

    if (!gameInLogs) {
      return null;
    }

    return gameInLogs;
  }

  async create(gameInLog: GameInLog) {
    this.items.push(gameInLog);

    DomainEvents.dispatchEventsForAggregate(gameInLog.id);
  }

  async save(gameInLog: GameInLog) {
    const gameinlogIndex = this.items.findIndex((item) => item.id.equals(gameInLog.id));

    if (gameinlogIndex < 0) {
      return;
    }

    this.items[gameinlogIndex] = gameInLog;

    DomainEvents.dispatchEventsForAggregate(gameInLog.id);
  }
}
