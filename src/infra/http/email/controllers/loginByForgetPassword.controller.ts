import {
  Controller, Post, HttpCode, UnauthorizedException, BadRequestException, NotFoundException, Param,
} from '@nestjs/common';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { Public } from '@/infra/auth/public';
import { ApiTags } from '@nestjs/swagger';
import { LoginByForgetPasswordUseCase } from '../useCase/loginByForgetPassword.useCase';

@ApiTags('Email')
@Controller('/users/email/:userEmail/login')
export class LoginByForgetPasswordController {
  constructor(private loginByForgetPasswordUseCase: LoginByForgetPasswordUseCase) {}

  @Post()
  @HttpCode(201)
  @Public()
  async handle(
  @Param('userEmail') userEmail: string,
  ) {
    const result = await this.loginByForgetPasswordUseCase.execute({
      userEmail,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const { accessToken } = result.value;

    return { accessToken };
  }
}
