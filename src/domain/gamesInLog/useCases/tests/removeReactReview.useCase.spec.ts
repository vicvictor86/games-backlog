import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesInLogRepository } from 'test/repositories/InMemoryGamesInLog.repository';
import { InMemoryReviewsRepository } from 'test/repositories/InMemoryReviews.repository';
import { makeGameInLog } from 'test/factories/makeGameInLog';
import { makeReview } from 'test/factories/makeReview';
import { InMemoryReviewsReactionsRepository } from 'test/repositories/InMemoryReviewsReactions.repository';
import { makeReviewReaction } from 'test/factories/makeReviewReaction';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { RemoveReactReviewUseCase } from '../removeReactReview.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesInLogRepository: InMemoryGamesInLogRepository;
let inMemoryReviewsRepository: InMemoryReviewsRepository;
let inMemoryReviewsReactionsRepository: InMemoryReviewsReactionsRepository;
let sut: RemoveReactReviewUseCase;

describe('React to a Game Review Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesInLogRepository = new InMemoryGamesInLogRepository();
    inMemoryReviewsRepository = new InMemoryReviewsRepository();
    inMemoryReviewsReactionsRepository = new InMemoryReviewsReactionsRepository();

    sut = new RemoveReactReviewUseCase(
      inMemoryReviewsReactionsRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to remove a reaction from a game review', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    const reviewReaction = makeReviewReaction({ reactOwnerId: user.id, reviewId: review.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);
    await inMemoryReviewsReactionsRepository.create(reviewReaction);

    const result = await sut.execute({
      reviewReactionId: reviewReaction.id.toString(),
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    const reviewsReactions = inMemoryReviewsReactionsRepository.items;
    expect(reviewsReactions.length).toBe(0);
  });

  it('should not be able to a user remove the reaction from a game review of other user', async () => {
    const user = makeUser({ role: 'CLIENT' });
    const otherUse = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    const reviewReaction = makeReviewReaction({ reactOwnerId: user.id, reviewId: review.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryUsersRepository.create(otherUse);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);
    await inMemoryReviewsReactionsRepository.create(reviewReaction);

    const result = await sut.execute({
      reviewReactionId: reviewReaction.id.toString(),
      userId: otherUse.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    const reviewsReactions = inMemoryReviewsReactionsRepository.items;
    expect(reviewsReactions.length).toBe(1);
  });
});
