import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesInLogRepository } from 'test/repositories/InMemoryGamesInLog.repository';
import { InMemoryReviewsRepository } from 'test/repositories/InMemoryReviews.repository';
import { makeGameInLog } from 'test/factories/makeGameInLog';
import { makeReview } from 'test/factories/makeReview';
import { InMemoryAnswersRepository } from 'test/repositories/InMemoryAnswers.repository';
import { AnswerReviewUseCase } from '../answerReview.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesInLogRepository: InMemoryGamesInLogRepository;
let inMemoryReviewsRepository: InMemoryReviewsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerReviewUseCase;

describe('React to a Game Review Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesInLogRepository = new InMemoryGamesInLogRepository();
    inMemoryReviewsRepository = new InMemoryReviewsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository();

    sut = new AnswerReviewUseCase(
      inMemoryAnswersRepository,
      inMemoryUsersRepository,
      inMemoryReviewsRepository,
    );
  });

  it('should be able to answer a game review', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);

    const result = await sut.execute({
      reviewId: review.id.toString(),
      userId: user.id.toString(),
      content: 'Answer content',
    });

    expect(result.isRight()).toBe(true);
    const answers = inMemoryAnswersRepository.items;
    expect(answers.length).toBe(1);
    expect(answers[0]).toEqual(expect.objectContaining({
      ownerId: user.id,
      reviewId: review.id,
      content: 'Answer content',
    }));
  });
});
