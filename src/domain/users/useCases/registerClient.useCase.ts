import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UserAlreadyExistsError } from './errors/UserAlreadyExistsError';
import { HashGenerator } from '../cryptography/hashGenerator';
import { Encrypter } from '../cryptography/encrypter';
import { User } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';

interface RegisterClientUseCaseRequest {
  name: string;
  email: string;
  password: string;
  username : string;
  bio?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  birthDate: Date;
}

type RegisterClientUseCaseResponse = Either<UserAlreadyExistsError, {
  client: User;
  accessToken: string;
}>;

@Injectable()
export class RegisterClientUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    name,
    password,
    birthDate,
    username,
    bio,
    facebook,
    twitter,
  }: RegisterClientUseCaseRequest): Promise<RegisterClientUseCaseResponse> {
    const emailInLowerCase = email.toLowerCase();

    const userWithSameEmail = await this.usersRepository.findByEmail(emailInLowerCase);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(emailInLowerCase));
    }

    const userAlreadyExists = await this.usersRepository.findByUsername(username);

    if (userAlreadyExists) {
      return left(new UserAlreadyExistsError(username));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const client = User.create({
      email: emailInLowerCase,
      name,
      password: hashedPassword,
      birthDate,
      username,
      bio,
      facebook,
      twitter,
      role: 'CLIENT',
    });

    await this.usersRepository.create(client);

    const accessToken = await this.encrypter.encrypt({ sub: client.id.toString() });

    return right({ client, accessToken });
  }
}
