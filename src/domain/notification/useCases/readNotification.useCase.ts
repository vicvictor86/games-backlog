import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { NotificationsRepository } from '../repositories/notifications.repository';
import { Notification } from '../entities/notification';

interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
  notification: Notification;
}>;

@Injectable()
export class ReadNotificationUseCase {
  constructor(
    private notificationsRepository: NotificationsRepository,
  ) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.get(recipientId, notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationsRepository.save(notification);

    return right({ notification });
  }
}
