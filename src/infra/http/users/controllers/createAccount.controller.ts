import {
  BadRequestException,
  Body, ConflictException, Controller, HttpCode, Post,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { RegisterClientUseCase } from '@/domain/users/useCases/registerClient.useCase';
import { UserAlreadyExistsError } from '@/domain/users/useCases/errors/UserAlreadyExistsError';
import { ApiTags } from '@nestjs/swagger';
import { createAccountBodyValidationPipe } from '../validation/createAccount.validation';
import { SendEmailConfirmationUseCase } from '../../email/useCase/sendEmailConfirmation.useCase';
import { CreateAccountDTO } from '../dtos/CreateAccount.dto';

@ApiTags('Users')
@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(
    private registerClientUseCase: RegisterClientUseCase,
    private sendEmailConfirmationUseCase: SendEmailConfirmationUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(createAccountBodyValidationPipe) body: CreateAccountDTO) {
    const {
      name, email, password, birthDate, username, bio,
      facebook, twitter,
    } = body;

    const result = await this.registerClientUseCase.execute({
      name,
      username,
      email,
      password,
      birthDate,
      bio,
      facebook,
      twitter,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const { client, accessToken } = result.value;

    this.sendEmailConfirmationUseCase.execute({
      userEmail: client.email,
      accessToken,
    });
  }
}
