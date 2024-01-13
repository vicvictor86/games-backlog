import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesListsRepository } from 'test/repositories/InMemoryGamesLists.repository';
import { CreateGamesListUseCase } from '../createGamesList.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesListRepository: InMemoryGamesListsRepository;
let sut: CreateGamesListUseCase;

describe('Create Games List In Log Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesListRepository = new InMemoryGamesListsRepository();
    sut = new CreateGamesListUseCase(
      inMemoryUsersRepository,
      inMemoryGamesListRepository,
    );
  });

  it('should be able to create a games list', async () => {
    const user = makeUser({ role: 'CLIENT' });

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      ownerId: user.id.toString(),
      name: 'My Games List',
      description: 'My description',
      visibility: 'PUBLIC',
    });

    expect(result.isRight()).toBe(true);

    const gamesList = inMemoryGamesListRepository.items[0];
    expect(gamesList).toEqual(expect.objectContaining({
      ownerId: user.id,
      name: 'My Games List',
      description: 'My description',
    }));
  });
});
