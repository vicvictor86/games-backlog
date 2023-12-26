import { Module } from '@nestjs/common';
import { AuthenticateUserUseCase } from '@/domain/users/useCases/authenticateUser.useCase';
import { ChangeUserRoleUseCase } from '@/domain/users/useCases/changeUserRole.useCase';
import { RegisterClientUseCase } from '@/domain/users/useCases/registerClient.useCase';
import { DatabaseModule } from '@/infra/database/database.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { NotificationsModule } from '@/infra/events/notifications/notifications.module';
import { EmailModule } from '../email/email.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { ChangeUserRoleController } from './controllers/changeUserRole.controller';
import { CreateAccountController } from './controllers/createAccount.controller';
import { SendEmailConfirmationUseCase } from '../email/useCase/sendEmailConfirmation.useCase';

@Module({
  imports: [DatabaseModule, CryptographyModule, NotificationsModule, EmailModule],
  controllers: [
    AuthenticateController,
    ChangeUserRoleController,
    CreateAccountController,
  ],
  providers: [
    AuthenticateUserUseCase,
    ChangeUserRoleUseCase,
    RegisterClientUseCase,
    SendEmailConfirmationUseCase,
  ],
})
export class UsersModule {}
