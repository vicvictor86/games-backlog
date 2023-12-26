import {
  BadRequestException,
  Body, Controller, HttpCode, NotFoundException, Patch, UnauthorizedException,
} from '@nestjs/common';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { CurrentUser } from '@/infra/auth/currentUserDecorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { ChangeUserRoleUseCase } from '@/domain/users/useCases/changeUserRole.useCase';
import { ApiTags } from '@nestjs/swagger';
import { changeUserRoleBodyValidationPipe } from '../validation/changeUserRole.validation';
import { ChangeUserRoleDTO } from '../dtos/ChangeUserRole.dto';

@ApiTags('Users')
@Controller('/accounts/change-role')
export class ChangeUserRoleController {
  constructor(private changeUserRoleUseCase: ChangeUserRoleUseCase) {}

  @Patch()
  @HttpCode(200)
  async handle(
  @Body(changeUserRoleBodyValidationPipe) body: ChangeUserRoleDTO,
    @CurrentUser() user: UserPayload,
  ) {
    const {
      role, userToChangeRoleId,
    } = body;
    const userId = user.sub;

    const result = await this.changeUserRoleUseCase.execute({
      userId,
      userToChangeRoleId,
      role,
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
  }
}
