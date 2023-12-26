import {
  Controller, HttpCode, BadRequestException, Post, Body, UnauthorizedException,
} from '@nestjs/common';
import { AuthenticateUserUseCase } from '@/domain/users/useCases/authenticateUser.useCase';
import { WrongCredentialsError } from '@/domain/users/useCases/errors/WrongCredentialsErrors';
import { ApiTags } from '@nestjs/swagger';
import { authenticateBodyValidationPipe } from '../../users/validation/authenticate.validation';
import { SendEmailConfirmationUseCase } from '../useCase/sendEmailConfirmation.useCase';
import { AuthenticateDTO } from '../../users/dtos/Authenticate.dto';

@ApiTags('Email')
@Controller('/users/email/send-confirmation')
export class SendEmailConfirmationController {
  constructor(
    private sendEmailConfirmationUseCase: SendEmailConfirmationUseCase,
    private authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  @Post()
  @HttpCode(204)
  async handle(@Body(authenticateBodyValidationPipe) body: AuthenticateDTO) {
    const { email, password } = body;

    const resultAuthentication = await this.authenticateUserUseCase.execute({
      email,
      password,
    });

    if (resultAuthentication.isLeft()) {
      const error = resultAuthentication.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const { accessToken } = resultAuthentication.value;

    await this.sendEmailConfirmationUseCase.execute({
      accessToken,
      userEmail: email,
    });
  }
}
