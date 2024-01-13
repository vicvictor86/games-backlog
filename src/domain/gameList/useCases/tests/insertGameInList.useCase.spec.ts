import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesListsRepository } from 'test/repositories/InMemoryGamesLists.repository';
import { makeGamesList } from 'test/factories/makeGamesList';
import { InMemoryGamesInLogRepository } from 'test/repositories/InMemoryGamesInLog.repository';
import { InMemoryGamesInListsRepository } from 'test/repositories/InMemoryGamesInLists.repository';
import { makeGameInLog } from 'test/factories/makeGameInLog';
import { InsertGameInListUseCase } from '../insertGameInList.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesListRepository: InMemoryGamesListsRepository;
let inMemoryGamesInListRepository: InMemoryGamesInListsRepository;
let inMemoryGamesInLogRepository: InMemoryGamesInLogRepository;

let sut: InsertGameInListUseCase;

describe('Edit Games List Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesListRepository = new InMemoryGamesListsRepository();
    inMemoryGamesInListRepository = new InMemoryGamesInListsRepository();
    inMemoryGamesInLogRepository = new InMemoryGamesInLogRepository();
    sut = new InsertGameInListUseCase(
      inMemoryUsersRepository,
      inMemoryGamesListRepository,
      inMemoryGamesInListRepository,
      inMemoryGamesInLogRepository,
    );
  });

  it('should be able to insert a game in a list', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const gameInLog = makeGameInLog({ ownerId: user.id });
    const gamesList = makeGamesList({ ownerId: user.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesListRepository.create(gamesList);
    await inMemoryGamesInLogRepository.create(gameInLog);

    const result = await sut.execute({
      ownerId: user.id.toString(),
      gameInLogId: gameInLog.id.toString(),
      listId: gamesList.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    const gamesInLists = inMemoryGamesInListRepository.items[0];
    expect(gamesInLists.gameInLogId).toBe(gameInLog.id);
    expect(gamesInLists.listId).toBe(gamesList.id);
    expect(gamesInLists.igdbId).toBe(gameInLog.gameIGDBId);
  });
});
