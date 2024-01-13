import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { FollowingsRepository } from '../repositories/followings.repository';
import { FollowersRepository } from '../repositories/followers.repository';
import { Following } from '../entities/following.entity';
import { Followed } from '../entities/followed.entity';

interface FollowUserUseCaseRequest {
  userId: string;
  userToFollowId: string;
}

type FollowUserUseCaseResponse = Either<ResourceNotFoundError, {
}>;

@Injectable()
export class FollowUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private followingsRepository: FollowingsRepository,
    private followersRepository: FollowersRepository,
  ) {}

  async execute({
    userId,
    userToFollowId,
  }: FollowUserUseCaseRequest): Promise<FollowUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const following = Following.create({
      userAccountId: new UniqueEntityId(userId),
      userFollowingId: new UniqueEntityId(userToFollowId),
    });

    await this.followingsRepository.create(following);

    const followed = Followed.create({
      userAccountId: new UniqueEntityId(userToFollowId),
      userFollowedId: new UniqueEntityId(userId),
    });

    await this.followersRepository.create(followed);

    return right({});
  }
}
