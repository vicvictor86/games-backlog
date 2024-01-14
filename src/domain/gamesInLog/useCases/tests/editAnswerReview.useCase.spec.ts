import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesInLogRepository } from 'test/repositories/InMemoryGamesInLog.repository';
import { InMemoryReviewsRepository } from 'test/repositories/InMemoryReviews.repository';
import { makeGameInLog } from 'test/factories/makeGameInLog';
import { makeReview } from 'test/factories/makeReview';
import { InMemoryAnswersRepository } from 'test/repositories/InMemoryAnswers.repository';
import { makeAnswer } from 'test/factories/makeAnswer';
import { EditAnswerUseCase } from '../editAnswer.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesInLogRepository: InMemoryGamesInLogRepository;
let inMemoryReviewsRepository: InMemoryReviewsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer Review Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesInLogRepository = new InMemoryGamesInLogRepository();
    inMemoryReviewsRepository = new InMemoryReviewsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository();

    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to edit a answer of a game review', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    const answer = makeAnswer({ ownerId: user.id, reviewId: review.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);
    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      userId: user.id.toString(),
      answerId: answer.id.toString(),
      content: 'Edited Content',
    });

    expect(result.isRight()).toBe(true);
    const answers = inMemoryAnswersRepository.items;
    expect(answers.length).toBe(1);
    expect(answers[0].content).toEqual('Edited Content');
    expect(answers[0].updatedAt).toBeTruthy();
  });

  it('should not be able to edit a answer of a game review from other user', async () => {
    const user = makeUser({ role: 'CLIENT' });
    const otherUser = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    const answer = makeAnswer({ ownerId: user.id, reviewId: review.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryUsersRepository.create(otherUser);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);
    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      userId: otherUser.id.toString(),
      answerId: answer.id.toString(),
      content: 'Edited Content',
    });

    expect(result.isLeft()).toBe(true);
  });
});
