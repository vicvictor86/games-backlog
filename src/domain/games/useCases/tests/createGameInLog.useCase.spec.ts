import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesInLogRepository } from 'test/repositories/InMemoryGamesInLog.repository';
import { InMemoryReviewsRepository } from 'test/repositories/InMemoryReviews.repository';
import { CreateGameInLogUseCase } from '../createGameInLog.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesInLogRepository: InMemoryGamesInLogRepository;
let inMemoryReviewsRepository: InMemoryReviewsRepository;
let sut: CreateGameInLogUseCase;

describe('Create Game In Log Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesInLogRepository = new InMemoryGamesInLogRepository();
    inMemoryReviewsRepository = new InMemoryReviewsRepository();
    sut = new CreateGameInLogUseCase(
      inMemoryGamesInLogRepository,
      inMemoryUsersRepository,
      inMemoryReviewsRepository,
    );
  });

  it('should be able to change a user role', async () => {
    const user = makeUser({ role: 'CLIENT' });
    const userToBeAdmin = makeUser({ role: 'CLIENT' });

    await inMemoryUsersRepository.create(user);
    await inMemoryUsersRepository.create(userToBeAdmin);

    const result = await sut.execute({
      currentStatus: 'BACKLOG',
      ownerId: user.id.toString(),
      gameIGDBId: '123',
      platform: 'PS4',
      playedMedium: 'OWNED',
      rating: 5,
      reviewContent: 'Great game',
      timePlayed: 1000,
      wasPlatinum: false,
      wasReplayed: false,
      startedOn: new Date(2023, 1, 1),
      finishedOn: new Date(2023, 1, 2),
    });

    expect(result.isRight()).toBe(true);

    const game = inMemoryGamesInLogRepository.items[0];
    expect(game).toEqual(expect.objectContaining({
      currentStatus: 'BACKLOG',
      ownerId: user.id,
      gameIGDBId: '123',
      platform: 'PS4',
      playedMedium: 'OWNED',
      timePlayed: 1000,
      wasPlatinum: false,
      wasReplayed: false,
    }));

    const review = inMemoryReviewsRepository.items[0];
    expect(review).toEqual(expect.objectContaining({
      rating: 5,
      content: 'Great game',
      gameInLog: game.id,
      ownerId: user.id,
    }));
  });
});
