import {
  Controller, Post, Body, UnauthorizedException, BadRequestException,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { AuthenticateUserUseCase } from '@/domain/users/useCases/authenticateUser.useCase';
import { WrongCredentialsError } from '@/domain/users/useCases/errors/WrongCredentialsErrors';
import { ApiTags } from '@nestjs/swagger';
import { authenticateBodyValidationPipe } from '../validation/authenticate.validation';
import { AuthenticateDTO } from '../dtos/Authenticate.dto';

@ApiTags('Users')
@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {}

  @Post()
  @Public()
  async handle(@Body(authenticateBodyValidationPipe) body: AuthenticateDTO) {
    const { email, password } = body;

    const result = await this.authenticateUserUseCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    if (result.value.emailConfirmed === false) {
      throw new UnauthorizedException('Email not confirmed');
    }

    const { accessToken } = result.value;

    return {
      accessToken,
    };
  }
}
