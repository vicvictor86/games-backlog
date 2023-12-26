import {
  Controller, HttpCode, Get, BadRequestException, Query, Param,
} from '@nestjs/common';
import { FetchNotificationsUseCase } from '@/domain/users/useCases/fetchNotifications.useCase';
import { ApiTags } from '@nestjs/swagger';
import { pageQueryValidationPipe, returnPerPageQueryValidationPipe } from '../../shared/dtos/QueryParams.dto';
import { NotificationPresenter } from '../../shared/presenter/notification.presenter';

@ApiTags('Notifications')
@Controller('/notifications/:userId')
export class FetchNotificationsController {
  constructor(private fetchNotificationsUseCase: FetchNotificationsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
  @Param('userId') userId: string,
    @Query('page', pageQueryValidationPipe) page: number,
    @Query('returnPerPage', returnPerPageQueryValidationPipe) returnPerPage: number,
  ) {
    const result = await this.fetchNotificationsUseCase.execute({
      userId,
      page,
      returnPerPage,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { notifications } = result.value;

    return { notifications: notifications.map((notification) => NotificationPresenter.toHTTP(notification)) };
  }
}
