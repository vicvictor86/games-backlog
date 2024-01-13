import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryFollowersRepository } from 'test/repositories/InMemoryFollowers.repository';
import { InMemoryFollowingsRepository } from 'test/repositories/InMemoryFollowings.repository';
import { makeFollowing } from 'test/factories/makeFollowing';
import { makeFollowed } from 'test/factories/makeFollowed';
import { UnfollowUserUseCase } from '../unfollowUser.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryFollowersRepository: InMemoryFollowersRepository;
let inMemoryFollowingRepository: InMemoryFollowingsRepository;
let sut: UnfollowUserUseCase;

describe('Unfollow User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryFollowersRepository = new InMemoryFollowersRepository();
    inMemoryFollowingRepository = new InMemoryFollowingsRepository();

    sut = new UnfollowUserUseCase(
      inMemoryUsersRepository,
      inMemoryFollowingRepository,
      inMemoryFollowersRepository,
    );
  });

  it('should be able to unfollow a user', async () => {
    const user = makeUser({ role: 'CLIENT' });
    const userToUnfollow = makeUser({ role: 'CLIENT' });
    const following = makeFollowing({ userAccountId: user.id, userFollowingId: userToUnfollow.id });
    const followed = makeFollowed({ userAccountId: userToUnfollow.id, userFollowedId: user.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryUsersRepository.create(userToUnfollow);
    await inMemoryFollowingRepository.create(following);
    await inMemoryFollowersRepository.create(followed);

    const result = await sut.execute({
      userId: user.id.toString(),
      userToUnfollowId: userToUnfollow.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    const followers = inMemoryFollowersRepository.items;
    expect(followers).toHaveLength(0);

    const followings = inMemoryFollowingRepository.items;
    expect(followings).toHaveLength(0);
  });
});
