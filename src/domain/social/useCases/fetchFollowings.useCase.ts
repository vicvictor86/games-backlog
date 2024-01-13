import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { FollowingsRepository } from '../repositories/followings.repository';
import { Following } from '../entities/following.entity';

interface FetchFollowingsUseCaseRequest {
  userId: string;

  page: number;
  returnPerPage: number;
}

type FetchFollowingsUseCaseResponse = Either<ResourceNotFoundError, {
  followings: Following[];
}>;

@Injectable()
export class FetchFollowingsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private followingsRepository: FollowingsRepository,
  ) {}

  async execute({
    userId,
    page,
    returnPerPage,
  }: FetchFollowingsUseCaseRequest): Promise<FetchFollowingsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const followings = await this.followingsRepository.findByUserAccountId(userId, { page, returnPerPage });

    return right({ followings });
  }
}
