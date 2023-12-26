import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { Notification } from '@/domain/notification/entities/notification';
import { NotificationsRepository } from '@/domain/notification/repositories/notifications.repository';

export interface FetchNotificationsUseCaseRequest {
  userId: string;
  page: number;
  returnPerPage: number;
}

type FetchNotificationsUseCaseResponse = Either<null, {
  notifications: Notification[];
}>;

@Injectable()
export class FetchNotificationsUseCase {
  constructor(
    private notificationsRepository: NotificationsRepository,
  ) {}

  async execute({
    userId,
    returnPerPage,
    page,
  }: FetchNotificationsUseCaseRequest): Promise<FetchNotificationsUseCaseResponse> {
    const notifications = await this.notificationsRepository.fetchByUserId(userId, { page, returnPerPage });

    return right({
      notifications,
    });
  }
}
