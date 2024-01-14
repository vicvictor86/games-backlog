import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesInLogRepository } from 'test/repositories/InMemoryGamesInLog.repository';
import { InMemoryReviewsRepository } from 'test/repositories/InMemoryReviews.repository';
import { makeGameInLog } from 'test/factories/makeGameInLog';
import { makeReview } from 'test/factories/makeReview';
import { InMemoryAnswersRepository } from 'test/repositories/InMemoryAnswers.repository';
import { makeAnswer } from 'test/factories/makeAnswer';
import { FetchAnswersByReviewUseCase } from '../fetchAnswersByReview.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesInLogRepository: InMemoryGamesInLogRepository;
let inMemoryReviewsRepository: InMemoryReviewsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchAnswersByReviewUseCase;

describe('Fetch Answers By Review Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesInLogRepository = new InMemoryGamesInLogRepository();
    inMemoryReviewsRepository = new InMemoryReviewsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository();

    sut = new FetchAnswersByReviewUseCase(
      inMemoryReviewsRepository,
      inMemoryAnswersRepository,
    );
  });

  it('should be able to fetch answers of a game review', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    const answer = makeAnswer({ ownerId: user.id, reviewId: review.id, content: 'Content' });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);
    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      reviewId: review.id.toString(),
      page: 1,
      returnPerPage: 10,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.answers).toEqual(expect.arrayContaining([
        expect.objectContaining({
          ownerId: user.id,
          reviewId: review.id,
          content: 'Content',
        }),
      ]));
    }
  });
});
