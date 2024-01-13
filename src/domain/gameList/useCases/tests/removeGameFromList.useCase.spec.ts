import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesListsRepository } from 'test/repositories/InMemoryGamesLists.repository';
import { makeGamesList } from 'test/factories/makeGamesList';
import { InMemoryGamesInListsRepository } from 'test/repositories/InMemoryGamesInLists.repository';
import { makeGameInList } from 'test/factories/makeGameInList';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { RemoveGameFromListUseCase } from '../removeGameFromList.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesListRepository: InMemoryGamesListsRepository;
let inMemoryGamesInListsRepository: InMemoryGamesInListsRepository;
let sut: RemoveGameFromListUseCase;

describe('Remove Games from List Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesListRepository = new InMemoryGamesListsRepository();
    inMemoryGamesInListsRepository = new InMemoryGamesInListsRepository();

    sut = new RemoveGameFromListUseCase(
      inMemoryGamesInListsRepository,
      inMemoryGamesListRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to remove a game from a certain list', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const gamesList1 = makeGamesList({ ownerId: user.id });
    const gameInList = makeGameInList({ listId: gamesList1.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesListRepository.create(gamesList1);
    await inMemoryGamesInListsRepository.create(gameInList);

    const result = await sut.execute({
      userId: user.id.toString(),
      gameInListId: gameInList.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    const gamesInList = inMemoryGamesInListsRepository.items;
    expect(gamesInList).toHaveLength(0);
  });

  it('should not be able to remove a game from a other user list', async () => {
    const listOwner = makeUser({ role: 'CLIENT' });
    const otherUser = makeUser({ role: 'CLIENT' });

    const gamesList1 = makeGamesList({ ownerId: listOwner.id });
    const gameInList = makeGameInList({ listId: gamesList1.id });

    await inMemoryUsersRepository.create(listOwner);
    await inMemoryUsersRepository.create(otherUser);
    await inMemoryGamesListRepository.create(gamesList1);
    await inMemoryGamesInListsRepository.create(gameInList);

    const result = await sut.execute({
      gameInListId: gameInList.id.toString(),
      userId: otherUser.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
