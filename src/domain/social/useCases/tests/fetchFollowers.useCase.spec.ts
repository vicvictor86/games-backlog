import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryFollowersRepository } from 'test/repositories/InMemoryFollowers.repository';
import { InMemoryFollowingsRepository } from 'test/repositories/InMemoryFollowings.repository';
import { makeFollowing } from 'test/factories/makeFollowing';
import { makeFollowed } from 'test/factories/makeFollowed';
import { FetchFollowersUseCase } from '../fetchFollowers.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryFollowersRepository: InMemoryFollowersRepository;
let inMemoryFollowingRepository: InMemoryFollowingsRepository;
let sut: FetchFollowersUseCase;

describe('Fetch Followers Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryFollowersRepository = new InMemoryFollowersRepository();
    inMemoryFollowingRepository = new InMemoryFollowingsRepository();

    sut = new FetchFollowersUseCase(
      inMemoryUsersRepository,
      inMemoryFollowersRepository,
    );
  });

  it('should be able to fetch followers from a user', async () => {
    const user = makeUser({ role: 'CLIENT' });
    const userToFollow = makeUser({ role: 'CLIENT' });
    const following = makeFollowing({ userAccountId: user.id, userFollowingId: userToFollow.id });
    const followed = makeFollowed({ userAccountId: userToFollow.id, userFollowedId: user.id });

    await inMemoryUsersRepository.create(user);
    await inMemoryUsersRepository.create(userToFollow);
    await inMemoryFollowingRepository.create(following);
    await inMemoryFollowersRepository.create(followed);

    const result = await sut.execute({
      userId: userToFollow.id.toString(),
      page: 1,
      returnPerPage: 10,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.followers).toEqual(expect.arrayContaining([
        expect.objectContaining({
          userAccountId: userToFollow.id,
          userFollowedId: user.id,
        }),
      ]));
    }
  });
});
