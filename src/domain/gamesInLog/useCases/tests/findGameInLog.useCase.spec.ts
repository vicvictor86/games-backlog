import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesInLogRepository } from 'test/repositories/InMemoryGamesInLog.repository';
import { InMemoryReviewsRepository } from 'test/repositories/InMemoryReviews.repository';
import { makeGameInLog } from 'test/factories/makeGameInLog';
import { makeReview } from 'test/factories/makeReview';
import { SearchGameByIdUseCase } from '@/apis/igdb/useCases/searchGameById.useCase';
import { FindGameInLogUseCase } from '../findGameInLogWithReview.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesInLogRepository: InMemoryGamesInLogRepository;
let inMemoryReviewsRepository: InMemoryReviewsRepository;
let searchGameByIdUseCase: SearchGameByIdUseCase;
let sut: FindGameInLogUseCase;

describe('Find Game In Log Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesInLogRepository = new InMemoryGamesInLogRepository();
    inMemoryReviewsRepository = new InMemoryReviewsRepository();

    searchGameByIdUseCase = new SearchGameByIdUseCase();
    sut = new FindGameInLogUseCase(
      inMemoryGamesInLogRepository,
      searchGameByIdUseCase,
      inMemoryReviewsRepository,
    );
  });

  it('should be able to find a game in log by id', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id, gameIGDBId: String(740) });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);

    const result = await sut.execute({
      gameInLogId: game.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.game).toEqual({
        props: expect.objectContaining({
          gameIGDB: expect.objectContaining({
            id: expect.any(Number),
            category: expect.any(Number),
            name: expect.any(String),
            slug: expect.any(String),
          }),
          gameInLog: expect.objectContaining({
            props: expect.objectContaining({
              ownerId: user.id,
            }),
          }),
          review: expect.objectContaining({
            props: expect.objectContaining({
              ownerId: user.id,
              gameInLogId: game.id,
            }),
          }),
        }),
      });
    }
  });
});
