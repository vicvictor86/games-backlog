import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { FollowingsRepository } from '../repositories/followings.repository';
import { FollowersRepository } from '../repositories/followers.repository';

interface UnfollowUserUseCaseRequest {
  userId: string;
  userToUnfollowId: string;
}

type UnfollowUserUseCaseResponse = Either<ResourceNotFoundError, {
}>;

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private followingsRepository: FollowingsRepository,
    private followersRepository: FollowersRepository,
  ) {}

  async execute({
    userId,
    userToUnfollowId,
  }: UnfollowUserUseCaseRequest): Promise<UnfollowUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const userToUnfollow = await this.followingsRepository.findFollowing(user.id.toString(), userToUnfollowId);

    if (!userToUnfollow) {
      return left(new ResourceNotFoundError());
    }

    await this.followingsRepository.delete(userToUnfollow);

    const userUnfollow = await this.followersRepository.findFollower(userToUnfollowId, user.id.toString());

    if (!userUnfollow) {
      return left(new ResourceNotFoundError());
    }

    await this.followersRepository.delete(userUnfollow);

    return right({});
  }
}
