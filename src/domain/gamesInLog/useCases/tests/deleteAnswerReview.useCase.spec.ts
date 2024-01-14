import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesInLogRepository } from 'test/repositories/InMemoryGamesInLog.repository';
import { InMemoryReviewsRepository } from 'test/repositories/InMemoryReviews.repository';
import { makeGameInLog } from 'test/factories/makeGameInLog';
import { makeReview } from 'test/factories/makeReview';
import { InMemoryAnswersRepository } from 'test/repositories/InMemoryAnswers.repository';
import { makeAnswer } from 'test/factories/makeAnswer';
import { DeleteAnswerReviewUseCase } from '../deleteAnswerReview.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesInLogRepository: InMemoryGamesInLogRepository;
let inMemoryReviewsRepository: InMemoryReviewsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerReviewUseCase;

describe('Delete Answer Review Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesInLogRepository = new InMemoryGamesInLogRepository();
    inMemoryReviewsRepository = new InMemoryReviewsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository();

    sut = new DeleteAnswerReviewUseCase(
      inMemoryAnswersRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to answer a game review', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    const answer = makeAnswer({ ownerId: user.id, reviewId: review.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);
    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      answerReviewId: answer.id.toString(),
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    const answers = inMemoryAnswersRepository.items;
    expect(answers.length).toBe(0);
  });
});
