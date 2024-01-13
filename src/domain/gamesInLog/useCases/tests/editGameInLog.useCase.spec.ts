import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesInLogRepository } from 'test/repositories/InMemoryGamesInLog.repository';
import { InMemoryReviewsRepository } from 'test/repositories/InMemoryReviews.repository';
import { makeGameInLog } from 'test/factories/makeGameInLog';
import { makeReview } from 'test/factories/makeReview';
import { EditGameInLogUseCase } from '../editGameInLog.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesInLogRepository: InMemoryGamesInLogRepository;
let inMemoryReviewsRepository: InMemoryReviewsRepository;
let sut: EditGameInLogUseCase;

describe('Edit Game In Log Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesInLogRepository = new InMemoryGamesInLogRepository();
    inMemoryReviewsRepository = new InMemoryReviewsRepository();
    sut = new EditGameInLogUseCase(
      inMemoryGamesInLogRepository,
      inMemoryUsersRepository,
      inMemoryReviewsRepository,
    );
  });

  it('should be able to edit a game log', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);

    const result = await sut.execute({
      ownerId: user.id.toString(),
      gameIGDBId: game.gameIGDBId,
      currentStatus: 'BACKLOG',
      platform: 'PS3',
      playedMedium: 'BORROWED',
      timePlayed: 1000,
      wasPlatinum: true,
      wasReplayed: false,

      rating: 5,
      reviewContent: 'Great game',
    });

    expect(result.isRight()).toBe(true);

    const gameInLogUpdated = inMemoryGamesInLogRepository.items[0];
    expect(gameInLogUpdated).toEqual(expect.objectContaining({
      currentStatus: 'BACKLOG',
      ownerId: user.id,
      gameIGDBId: game.gameIGDBId,
      platform: 'PS3',
      playedMedium: 'BORROWED',
      timePlayed: 1000,
      wasPlatinum: true,
      wasReplayed: false,
    }));

    const reviewInLogUpdated = inMemoryReviewsRepository.items[0];
    expect(reviewInLogUpdated).toEqual(expect.objectContaining({
      gameInLogId: game.id,
      ownerId: user.id,
      rating: 5,
      content: 'Great game',
    }));
  });
});
