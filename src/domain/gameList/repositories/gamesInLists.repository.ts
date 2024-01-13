import { PaginationParams } from '@/core/repositories/paginationParams';
import { GameInList } from '../entities/gameInList.entity';

export abstract class GamesInListsRepository {
  abstract findById(id: string): Promise<GameInList | null>;
  abstract findByListId(listId: string, params: PaginationParams): Promise<GameInList[]>;
  abstract findByGameInLog(gameInLog: string): Promise<GameInList | null>;
  abstract findByIGDBId(igdbId: string): Promise<GameInList | null>;
  abstract create(gameInList: GameInList): Promise<void>;
  abstract save(gameInList: GameInList): Promise<void>;
  abstract delete(gameInList: GameInList): Promise<void>;
}
