import { Injectable } from '@nestjs/common';
import { Either, Left, Right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { InvalidAccessToken } from '@/core/errors/invalidAccessToken';

interface ConfirmAccountEmailUseCaseRequest {
  userEmail: string;
  accessToken: string;
}

type ConfirmAccountEmailUseCaseResponse = Either<ResourceNotFoundError | InvalidAccessToken, {}>;

@Injectable()
export class ConfirmAccountEmailUseCase {
  constructor(
    private userRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async execute({
    userEmail,
    accessToken,
  }: ConfirmAccountEmailUseCaseRequest): Promise<ConfirmAccountEmailUseCaseResponse> {
    const user = await this.userRepository.findByEmail(userEmail);

    if (!user) {
      return new Left(new ResourceNotFoundError());
    }

    if (user.emailConfirmed) {
      return new Right({});
    }

    const decoded = this.jwtService.decode(accessToken);

    if (!decoded) {
      return new Left(new InvalidAccessToken());
    }

    const { sub } = decoded as UserPayload;

    if (sub !== user.id.toString()) {
      return new Left(new InvalidAccessToken());
    }

    user.emailConfirmed = true;

    await this.userRepository.save(user);

    return new Right({});
  }
}
