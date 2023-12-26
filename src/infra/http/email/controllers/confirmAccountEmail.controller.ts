import {
  Controller, HttpCode, BadRequestException, Body, UnauthorizedException, Patch, NotFoundException,
} from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { Public } from '@/infra/auth/public';
import { InvalidAccessToken } from '@/core/errors/invalidAccessToken';
import { ApiTags } from '@nestjs/swagger';
import { ConfirmAccountEmailUseCase } from '../useCase/confirmAccountEmail.useCase';
import { ConfirmAccountEmailBodySchema, confirmAccountEmailBodyValidationPipe } from '../../users/validation/confirmAccountEmail.validation';

@ApiTags('Email')
@Controller('/accounts/confirm')
export class ConfirmAccountEmailController {
  constructor(
    private confirmAccountEmailUseCase: ConfirmAccountEmailUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  @Public()
  async handle(@Body(confirmAccountEmailBodyValidationPipe) body: ConfirmAccountEmailBodySchema) {
    const { email, accessToken } = body;

    const result = await this.confirmAccountEmailUseCase.execute({
      userEmail: email,
      accessToken,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidAccessToken:
          throw new UnauthorizedException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
