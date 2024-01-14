import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryGamesInLogRepository } from 'test/repositories/InMemoryGamesInLog.repository';
import { InMemoryReviewsRepository } from 'test/repositories/InMemoryReviews.repository';
import { makeGameInLog } from 'test/factories/makeGameInLog';
import { makeReview } from 'test/factories/makeReview';
import { InMemoryReviewsReactionsRepository } from 'test/repositories/InMemoryReviewsReactions.repository';
import { makeReviewReaction } from 'test/factories/makeReviewReaction';
import { ReactReviewUseCase } from '../reactReview.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryGamesInLogRepository: InMemoryGamesInLogRepository;
let inMemoryReviewsRepository: InMemoryReviewsRepository;
let inMemoryReviewsReactionsRepository: InMemoryReviewsReactionsRepository;
let sut: ReactReviewUseCase;

describe('React to a Game Review Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryGamesInLogRepository = new InMemoryGamesInLogRepository();
    inMemoryReviewsRepository = new InMemoryReviewsRepository();
    inMemoryReviewsReactionsRepository = new InMemoryReviewsReactionsRepository();

    sut = new ReactReviewUseCase(
      inMemoryReviewsReactionsRepository,
      inMemoryUsersRepository,
      inMemoryReviewsRepository,
    );
  });

  it('should be able to react for the first time to a game review', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);

    const result = await sut.execute({
      reviewId: review.id.toString(),
      reviewReactionType: 'LIKE',
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    const reviewsReactions = inMemoryReviewsReactionsRepository.items;
    expect(reviewsReactions.length).toBe(1);
    expect(reviewsReactions[0].reviewReaction).toBe('LIKE');
  });

  it('should be able to change the reaction type from a review the already be reacted', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const game = makeGameInLog({ ownerId: user.id });

    const review = makeReview({ ownerId: user.id, gameInLogId: game.id });

    const reviewReaction = makeReviewReaction({ reactOwnerId: user.id, reviewId: review.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryGamesInLogRepository.create(game);
    await inMemoryReviewsRepository.create(review);
    await inMemoryReviewsReactionsRepository.create(reviewReaction);

    const result = await sut.execute({
      reviewId: review.id.toString(),
      reviewReactionType: 'LOVE',
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    const reviewsReactions = inMemoryReviewsReactionsRepository.items;
    expect(reviewsReactions.length).toBe(1);
    expect(reviewsReactions[0].id).toEqual(reviewReaction.id);
    expect(reviewsReactions[0].reviewReaction).toBe('LOVE');
  });
});
