import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesInLogRepository } from 'test/repositories/InMemoryGamesInLog.repository';
import { InMemoryReviewsRepository } from 'test/repositories/InMemoryReviews.repository';
import { makeGameInLog } from 'test/factories/makeGameInLog';
import { makeReview } from 'test/factories/makeReview';
import { SearchGameByIdUseCase } from '@/apis/igdb/useCases/searchGameById.useCase';
import { FetchGamesInLogByUserUseCase } from '../fetchGamesInLogByUser.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesInLogRepository: InMemoryGamesInLogRepository;
let inMemoryReviewsRepository: InMemoryReviewsRepository;
let searchGameByIdUseCase: SearchGameByIdUseCase;
let sut: FetchGamesInLogByUserUseCase;

describe('Fetch Games In Log Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesInLogRepository = new InMemoryGamesInLogRepository();
    inMemoryReviewsRepository = new InMemoryReviewsRepository();

    searchGameByIdUseCase = new SearchGameByIdUseCase();
    sut = new FetchGamesInLogByUserUseCase(
      inMemoryGamesInLogRepository,
      inMemoryUsersRepository,
      searchGameByIdUseCase,
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
      ownerId: user.id.toString(),
      page: 1,
      returnPerPage: 10,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.gamesInfo).toEqual({
        igdbGames: expect.arrayContaining([
          expect.objectContaining({
            gameInfo: expect.objectContaining({
              id: expect.any(Number),
              category: expect.any(Number),
              name: expect.any(String),
              slug: expect.any(String),
            }),
          }),
        ]),
        games: expect.arrayContaining([
          expect.objectContaining({
            props: expect.objectContaining({
              ownerId: user.id,
              gameIGDBId: expect.any(String),
            }),
          }),
        ]),

      });
    }
  });
});
