import { Module } from '@nestjs/common';
import { SendNotificationUseCase } from '@/domain/notification/useCases/sendNotification.useCase';
import { NotificationsModule } from './notifications/notifications.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, NotificationsModule],
  providers: [
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
