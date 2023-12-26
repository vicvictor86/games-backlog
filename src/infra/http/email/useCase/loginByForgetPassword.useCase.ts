import { Injectable } from '@nestjs/common';
import { Either, Left, Right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { Encrypter } from '@/domain/users/cryptography/encrypter';

interface LoginByForgetPasswordUseCaseRequest {
  userEmail: string;
}

type LoginByForgetPasswordUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
  accessToken: string;
}>;

@Injectable()
export class LoginByForgetPasswordUseCase {
  constructor(
    private userRepository: UsersRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    userEmail,
  }: LoginByForgetPasswordUseCaseRequest): Promise<LoginByForgetPasswordUseCaseResponse> {
    const user = await this.userRepository.findByEmail(userEmail);

    if (!user) {
      return new Left(new ResourceNotFoundError());
    }

    if (!user.emailConfirmed) {
      return new Left(new NotAllowedError());
    }

    const accessToken = await this.encrypter.encrypt({ sub: user.id.toString() });

    return new Right({ accessToken });
  }
}
