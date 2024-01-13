import { UseCaseError } from '@/core/errors/useCaseErrors';

export class GamesListAlreadyExists extends Error implements UseCaseError {
  constructor(gamesListName: string) {
    super(`List with name ${gamesListName} already exists`);
  }
}
