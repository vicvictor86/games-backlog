import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { FollowersRepository } from '../repositories/followers.repository';
import { Followed } from '../entities/followed.entity';

interface FetchFollowersUseCaseRequest {
  userId: string;

  page: number;
  returnPerPage: number;
}

type FetchFollowersUseCaseResponse = Either<ResourceNotFoundError, {
  followers: Followed[];
}>;

@Injectable()
export class FetchFollowersUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private followersRepository: FollowersRepository,
  ) {}

  async execute({
    userId,
    page,
    returnPerPage,
  }: FetchFollowersUseCaseRequest): Promise<FetchFollowersUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const followers = await this.followersRepository.findByUserAccountId(userId, { page, returnPerPage });

    return right({ followers });
  }
}
