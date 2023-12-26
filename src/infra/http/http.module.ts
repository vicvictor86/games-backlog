import { Module } from '@nestjs/common';
import { NotificationsModule } from '../events/notifications/notifications.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    EmailModule,
    UsersModule,
    NotificationsModule,
  ],
})
export class HttpModule {}
