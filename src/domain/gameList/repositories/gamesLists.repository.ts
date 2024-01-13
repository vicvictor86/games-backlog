import { PaginationParams } from '@/core/repositories/paginationParams';
import { GamesList } from '../entities/gamesList.entity';

export abstract class GamesListsRepository {
  abstract findById(id: string): Promise<GamesList | null>;
  abstract findByOwnerId(ownerId: string, params: PaginationParams): Promise<GamesList[]>;
  abstract findByGamesListName(gamesListName: string): Promise<GamesList | null>;
  abstract create(gamesList: GamesList): Promise<void>;
  abstract save(gamesList: GamesList): Promise<void>;
  abstract delete(gamesList: GamesList): Promise<void>;
}
