import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { WrongCredentialsError } from './errors/WrongCredentialsErrors';
import { HashComparer } from '../cryptography/hashComparer';
import { Encrypter } from '../cryptography/encrypter';
import { UsersRepository } from '../repositories/users.repository';

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<WrongCredentialsError, {
  accessToken: string;
  emailConfirmed: boolean;
}>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const passwordsMatch = await this.hashComparer.compare(password, user.password);

    if (!passwordsMatch) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({ sub: user.id.toString() });

    if (!user.emailConfirmed) {
      right({ accessToken, emailConfirmed: false });
    }

    return right({ accessToken, emailConfirmed: true });
  }
}
