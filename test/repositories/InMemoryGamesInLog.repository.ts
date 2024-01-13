import { DomainEvents } from '@/core/events/domainEvents';
import { PaginationParams } from '@/core/repositories/paginationParams';
import { GameInLog } from '@/domain/gamesInLog/entities/gameInLog.entity';
import { GamesInLogRepository } from '@/domain/gamesInLog/repositories/gamesInLog.repository';

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

  async fetchManyByOwnerId(ownerId: string, { page, returnPerPage }: PaginationParams): Promise<GameInLog[]> {
    const gameInLogs = this.items
      .filter((item) => item.ownerId.toString() === ownerId)
      .slice((page - 1) * returnPerPage, page * returnPerPage);

    return gameInLogs;
  }

  async findByGameIGDBIdAndOwnerId(gameIGDBId: string, ownerId: string): Promise<GameInLog | null> {
    const gameInLog = this.items.find((item) => item.gameIGDBId.toString() === gameIGDBId && item.ownerId.toString() === ownerId);

    if (!gameInLog) {
      return null;
    }

    return gameInLog;
  }

  async create(gameInLog: GameInLog) {
    this.items.push(gameInLog);

    DomainEvents.dispatchEventsForAggregate(gameInLog.id);
  }

  async save(gameInLog: GameInLog) {
    const gameInLogIndex = this.items.findIndex((item) => item.id.equals(gameInLog.id));

    if (gameInLogIndex < 0) {
      return;
    }

    this.items[gameInLogIndex] = gameInLog;

    DomainEvents.dispatchEventsForAggregate(gameInLog.id);
  }

  async delete(gameInLog: GameInLog): Promise<void> {
    const gameInLogIndex = this.items.findIndex((item) => item.id.equals(gameInLog.id));

    if (gameInLogIndex < 0) {
      return;
    }

    this.items.splice(gameInLogIndex, 1);
  }
}
