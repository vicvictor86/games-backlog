import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesListsRepository } from 'test/repositories/InMemoryGamesLists.repository';
import { makeGamesList } from 'test/factories/makeGamesList';
import { DeleteGamesListUseCase } from '../deleteGamesList.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesListsRepository: InMemoryGamesListsRepository;
let sut: DeleteGamesListUseCase;

describe('Delete Game In Log Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesListsRepository = new InMemoryGamesListsRepository();
    sut = new DeleteGamesListUseCase(
      inMemoryGamesListsRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to delete a games list', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const gamesList = makeGamesList({ ownerId: user.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesListsRepository.create(gamesList);

    const result = await sut.execute({
      userId: user.id.toString(),
      gamesListId: gamesList.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    const gamesListUpdated = inMemoryGamesListsRepository.items;
    expect(gamesListUpdated).toHaveLength(0);
  });

  it('should not be able to a user delete a games list from other user', async () => {
    const otherUser = makeUser({ role: 'CLIENT' });
    const gamesListOwner = makeUser({ role: 'CLIENT' });

    const gamesList = makeGamesList({ ownerId: gamesListOwner.id });

    await inMemoryUsersRepository.create(gamesListOwner);
    await inMemoryUsersRepository.create(otherUser);
    await inMemoryGamesListsRepository.create(gamesList);

    const result = await sut.execute({
      userId: otherUser.id.toString(),
      gamesListId: gamesList.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
  });
});
