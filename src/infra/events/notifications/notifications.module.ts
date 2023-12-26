import { Module } from '@nestjs/common';
import { EnvModule } from '@/infra/env/env.module';
import { NotificationsRepository } from '@/domain/notification/repositories/notifications.repository';
import { FetchNotificationsController } from '@/infra/http/notifications/controllers/fetchNofications.controller';
import { FetchNotificationsUseCase } from '@/domain/users/useCases/fetchNotifications.useCase';
import { RedisNotificationService } from './redis/redisNotification.service';
import { RedisNotificationsRepository } from './redis/redisNotificationsRepository';

@Module({
  imports: [EnvModule],
  controllers: [
    FetchNotificationsController,
  ],
  providers: [
    RedisNotificationService,
    FetchNotificationsUseCase,
    {
      provide: NotificationsRepository,
      useClass: RedisNotificationsRepository,
    },
  ],
  exports: [
    NotificationsRepository,
  ],
})
export class NotificationsModule {}
