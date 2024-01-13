import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesListsRepository } from 'test/repositories/InMemoryGamesLists.repository';
import { makeGamesList } from 'test/factories/makeGamesList';
import { EditGamesListUseCase } from '../editGamesList.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesListRepository: InMemoryGamesListsRepository;
let sut: EditGamesListUseCase;

describe('Edit Games List Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesListRepository = new InMemoryGamesListsRepository();
    sut = new EditGamesListUseCase(
      inMemoryGamesListRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to edit a games list', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const gamesList = makeGamesList({ ownerId: user.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesListRepository.create(gamesList);

    const result = await sut.execute({
      ownerId: user.id.toString(),
      gamesListId: gamesList.id.toString(),
      description: 'New description',
      name: 'New name',
    });

    expect(result.isRight()).toBe(true);

    const gamesListUpdated = inMemoryGamesListRepository.items[0];
    expect(gamesListUpdated.name).toBe('New name');
    expect(gamesListUpdated.description).toBe('New description');
  });
});
