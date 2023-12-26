import { Module } from '@nestjs/common';
import { EnvModule } from '@/infra/env/env.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { FetchNotificationsUseCase } from '@/domain/users/useCases/fetchNotifications.useCase';
import { FetchNotificationsController } from './controllers/fetchNofications.controller';

@Module({
  imports: [EnvModule, DatabaseModule],
  controllers: [
    FetchNotificationsController,
  ],
  providers: [
    FetchNotificationsUseCase,
  ],
})
export class NotificationsModule {}
