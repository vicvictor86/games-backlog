import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesInLogRepository } from 'test/repositories/InMemoryGamesInLog.repository';
import { InMemoryReviewsRepository } from 'test/repositories/InMemoryReviews.repository';
import { makeGameInLog } from 'test/factories/makeGameInLog';
import { makeReview } from 'test/factories/makeReview';
import { InMemoryAnswersRepository } from 'test/repositories/InMemoryAnswers.repository';
import { InMemoryAnswersReactionsRepository } from 'test/repositories/InMemoryAnswersReactions.repository';
import { makeAnswer } from 'test/factories/makeAnswer';
import { makeAnswerReaction } from 'test/factories/makeAnswerReaction';
import { ReactAnswerUseCase } from '../reactAnswer.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesInLogRepository: InMemoryGamesInLogRepository;
let inMemoryReviewsRepository: InMemoryReviewsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswersReactionsRepository: InMemoryAnswersReactionsRepository;
let sut: ReactAnswerUseCase;

describe('React to a Game Answer Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesInLogRepository = new InMemoryGamesInLogRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    inMemoryAnswersReactionsRepository = new InMemoryAnswersReactionsRepository();
    inMemoryReviewsRepository = new InMemoryReviewsRepository();

    sut = new ReactAnswerUseCase(
      inMemoryAnswersReactionsRepository,
      inMemoryUsersRepository,
      inMemoryAnswersRepository,
    );
  });

  it('should be able to react for the first time to a review answer', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    const answer = makeAnswer({ ownerId: user.id, reviewId: review.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);
    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      userId: user.id.toString(),
      answerReactionType: 'LIKE',
    });

    expect(result.isRight()).toBe(true);
    const answersReactions = inMemoryAnswersReactionsRepository.items;
    expect(answersReactions.length).toBe(1);
    expect(answersReactions[0].answerReaction).toBe('LIKE');
  });

  it('should be able to change the reaction type from a answer the already be reacted', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    const answer = makeAnswer({ ownerId: user.id, reviewId: review.id });

    const answerReaction = makeAnswerReaction({ reactOwnerId: user.id, answerId: answer.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);
    await inMemoryAnswersRepository.create(answer);
    await inMemoryAnswersReactionsRepository.create(answerReaction);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      userId: user.id.toString(),
      answerReactionType: 'LOVE',
    });

    expect(result.isRight()).toBe(true);
    const reviewsReactions = inMemoryAnswersReactionsRepository.items;
    expect(reviewsReactions.length).toBe(1);
    expect(reviewsReactions[0].id).toEqual(answerReaction.id);
    expect(reviewsReactions[0].answerReaction).toBe('LOVE');
  });
});
