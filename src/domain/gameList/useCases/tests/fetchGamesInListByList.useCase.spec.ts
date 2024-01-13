import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesListsRepository } from 'test/repositories/InMemoryGamesLists.repository';
import { makeGamesList } from 'test/factories/makeGamesList';
import { InMemoryGamesInListsRepository } from 'test/repositories/InMemoryGamesInLists.repository';
import { makeGameInList } from 'test/factories/makeGameInList';
import { FetchGamesInListByListUseCase } from '../fetchGamesInListByList.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesListRepository: InMemoryGamesListsRepository;
let inMemoryGamesInListsRepository: InMemoryGamesInListsRepository;
let sut: FetchGamesInListByListUseCase;

describe('Fetch Games in List by List Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesListRepository = new InMemoryGamesListsRepository();
    inMemoryGamesInListsRepository = new InMemoryGamesInListsRepository();

    sut = new FetchGamesInListByListUseCase(
      inMemoryGamesListRepository,
      inMemoryGamesInListsRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to fetch games in a certain list', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const gamesList1 = makeGamesList({ ownerId: user.id });
    const gameInList = makeGameInList({ listId: gamesList1.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesListRepository.create(gamesList1);
    await inMemoryGamesInListsRepository.create(gameInList);

    const result = await sut.execute({
      ownerId: user.id.toString(),
      listId: gamesList1.id.toString(),
      page: 1,
      returnPerPage: 10,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.gamesInList).toEqual(expect.arrayContaining([
        expect.objectContaining({
          listId: gamesList1.id,
        }),
      ]));
    }
  });

  it('should not be able to fetch games in a other user list that have visibility PRIVATE', async () => {
    const listOwner = makeUser({ role: 'CLIENT' });
    const otherUser = makeUser({ role: 'CLIENT' });

    const gamesList1 = makeGamesList({ ownerId: listOwner.id, visibility: 'PRIVATE' });
    const gameInList = makeGameInList({ listId: gamesList1.id });

    await inMemoryUsersRepository.create(listOwner);
    await inMemoryGamesListRepository.create(gamesList1);
    await inMemoryGamesInListsRepository.create(gameInList);

    const result = await sut.execute({
      ownerId: otherUser.id.toString(),
      listId: gamesList1.id.toString(),
      page: 1,
      returnPerPage: 10,
    });

    expect(result.isLeft()).toBe(true);
  });
});
