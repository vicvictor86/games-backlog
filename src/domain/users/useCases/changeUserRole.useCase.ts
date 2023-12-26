import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { Role } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';

interface ChangeUserRoleUseCaseRequest {
  userId: string
  userToChangeRoleId: string;
  role: Role;
}

type ChangeUserRoleUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

@Injectable()
export class ChangeUserRoleUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    userToChangeRoleId,
    role,
  }: ChangeUserRoleUseCaseRequest): Promise<ChangeUserRoleUseCaseResponse> {
    const userToChangeRole = await this.usersRepository.findById(userToChangeRoleId);
    if (!userToChangeRole) {
      return left(new ResourceNotFoundError());
    }

    const userIsAdmin = await this.usersRepository.isAdmin(userId);

    if (!userIsAdmin) {
      return left(new NotAllowedError());
    }

    userToChangeRole.role = role;

    await this.usersRepository.save(userToChangeRole);

    return right({});
  }
}
