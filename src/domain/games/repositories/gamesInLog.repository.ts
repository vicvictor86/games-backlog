import { GameInLog } from '../entities/gameInLog.entity';

export abstract class GamesInLogRepository {
  abstract findById(id: string): Promise<GameInLog | null>;
  abstract findByGameIGDBId(gameIGDBId: string): Promise<GameInLog | null>;
  abstract fetchManyByOwnerId(ownerId: string): Promise<GameInLog[] | null>;
  abstract create(gameInLog: GameInLog): Promise<void>;
  abstract save(gameInLog: GameInLog): Promise<void>;
}
