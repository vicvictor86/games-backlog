import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesListsRepository } from 'test/repositories/InMemoryGamesLists.repository';
import { makeGamesList } from 'test/factories/makeGamesList';
import { FetchGamesListsByUserUseCase } from '../fetchGamesListByUser.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesListRepository: InMemoryGamesListsRepository;
let sut: FetchGamesListsByUserUseCase;

describe('Fetch Games List by User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesListRepository = new InMemoryGamesListsRepository();

    sut = new FetchGamesListsByUserUseCase(
      inMemoryGamesListRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to fetch games lists by user id', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const gamesList1 = makeGamesList({ ownerId: user.id });
    const gamesList2 = makeGamesList({ ownerId: user.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesListRepository.create(gamesList1);
    await inMemoryGamesListRepository.create(gamesList2);

    const result = await sut.execute({
      ownerId: user.id.toString(),
      page: 1,
      returnPerPage: 10,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.gamesLists).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: gamesList1.id,
          ownerId: user.id,
          name: gamesList1.name,
          description: gamesList1.description,
        }),
        expect.objectContaining({
          id: gamesList2.id,
          ownerId: user.id,
          name: gamesList2.name,
          description: gamesList2.description,
        }),
      ]));
    }
  });
});
