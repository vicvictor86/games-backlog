import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesInLogRepository } from 'test/repositories/InMemoryGamesInLog.repository';
import { InMemoryReviewsRepository } from 'test/repositories/InMemoryReviews.repository';
import { makeGameInLog } from 'test/factories/makeGameInLog';
import { makeReview } from 'test/factories/makeReview';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { InMemoryAnswersReactionsRepository } from 'test/repositories/InMemoryAnswersReactions.repository';
import { makeAnswerReaction } from 'test/factories/makeAnswerReaction';
import { makeAnswer } from 'test/factories/makeAnswer';
import { InMemoryAnswersRepository } from 'test/repositories/InMemoryAnswers.repository';
import { RemoveReactAnswerUseCase } from '../removeReactAnswer.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesInLogRepository: InMemoryGamesInLogRepository;
let inMemoryReviewsRepository: InMemoryReviewsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswersReactionsRepository: InMemoryAnswersReactionsRepository;
let sut: RemoveReactAnswerUseCase;

describe('React to a Answer Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesInLogRepository = new InMemoryGamesInLogRepository();
    inMemoryReviewsRepository = new InMemoryReviewsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    inMemoryAnswersReactionsRepository = new InMemoryAnswersReactionsRepository();

    sut = new RemoveReactAnswerUseCase(
      inMemoryAnswersReactionsRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to remove a reaction from a answer', async () => {
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
      userId: user.id.toString(),
      answerReactionId: answerReaction.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    const reviewsReactions = inMemoryAnswersReactionsRepository.items;
    expect(reviewsReactions.length).toBe(0);
  });

  it('should not be able to a user remove the reaction from a answer that belong to other user', async () => {
    const user = makeUser({ role: 'CLIENT' });
    const otherUser = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    const answer = makeAnswer({ ownerId: user.id, reviewId: review.id });

    const answerReaction = makeAnswerReaction({ reactOwnerId: user.id, answerId: answer.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryUsersRepository.create(otherUser);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);
    await inMemoryAnswersRepository.create(answer);
    await inMemoryAnswersReactionsRepository.create(answerReaction);

    const result = await sut.execute({
      userId: otherUser.id.toString(),
      answerReactionId: answerReaction.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    const reviewsReactions = inMemoryAnswersReactionsRepository.items;
    expect(reviewsReactions.length).toBe(1);
  });
});
