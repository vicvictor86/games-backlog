import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesInLogRepository } from 'test/repositories/InMemoryGamesInLog.repository';
import { InMemoryReviewsRepository } from 'test/repositories/InMemoryReviews.repository';
import { makeGameInLog } from 'test/factories/makeGameInLog';
import { makeReview } from 'test/factories/makeReview';
import { DeleteGameInLogUseCase } from '../deleteGameInLog.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesInLogRepository: InMemoryGamesInLogRepository;
let inMemoryReviewsRepository: InMemoryReviewsRepository;
let sut: DeleteGameInLogUseCase;

describe('Delete Game In Log Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesInLogRepository = new InMemoryGamesInLogRepository();
    inMemoryReviewsRepository = new InMemoryReviewsRepository();
    sut = new DeleteGameInLogUseCase(
      inMemoryGamesInLogRepository,
      inMemoryUsersRepository,
      inMemoryReviewsRepository,
    );
  });

  it('should be able to delete a game log', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);

    const result = await sut.execute({
      gameInLogId: game.id.toString(),
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    const gameInLogUpdated = inMemoryGamesInLogRepository.items;
    expect(gameInLogUpdated).toHaveLength(0);

    const reviewUpdated = inMemoryReviewsRepository.items;
    expect(reviewUpdated).toHaveLength(0);
  });

  it('should not be able to a user delete a game log from other user', async () => {
    const otherUser = makeUser({ role: 'CLIENT' });
    const logOwner = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: logOwner.id });

    const review = makeReview({ ownerId: logOwner.id, gameInLogId: game.id });

    await inMemoryUsersRepository.create(logOwner);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);

    const result = await sut.execute({
      gameInLogId: game.id.toString(),
      userId: otherUser.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
  });
});
