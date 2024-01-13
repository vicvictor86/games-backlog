import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { makeUser } from 'test/factories/makeUser';
import { InMemoryFollowersRepository } from 'test/repositories/InMemoryFollowers.repository';
import { InMemoryFollowingsRepository } from 'test/repositories/InMemoryFollowings.repository';
import { FollowUserUseCase } from '../followUser.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryFollowersRepository: InMemoryFollowersRepository;
let inMemoryFollowingRepository: InMemoryFollowingsRepository;
let sut: FollowUserUseCase;

describe('Follow User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryFollowersRepository = new InMemoryFollowersRepository();
    inMemoryFollowingRepository = new InMemoryFollowingsRepository();

    sut = new FollowUserUseCase(
      inMemoryUsersRepository,
      inMemoryFollowingRepository,
      inMemoryFollowersRepository,
    );
  });

  it('should be able to follow a user', async () => {
    const user = makeUser({ role: 'CLIENT' });
    const userToFollow = makeUser({ role: 'CLIENT' });

    await inMemoryUsersRepository.create(user);
    await inMemoryUsersRepository.create(userToFollow);

    const result = await sut.execute({
      userId: user.id.toString(),
      userToFollowId: userToFollow.id.toString(),
    });

    expect(result.isRight()).toBe(true);

    const followed = inMemoryFollowersRepository.items[0];
    expect(followed).toEqual(expect.objectContaining({
      userAccountId: userToFollow.id,
      userFollowedId: user.id,
    }));

    const following = inMemoryFollowingRepository.items[0];
    expect(following).toEqual(expect.objectContaining({
      userAccountId: user.id,
      userFollowingId: userToFollow.id,
    }));
  });
});
