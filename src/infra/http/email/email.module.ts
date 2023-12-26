import { Module } from '@nestjs/common';
import { EnvModule } from '@/infra/env/env.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { AuthenticateUserUseCase } from '@/domain/users/useCases/authenticateUser.useCase';
import { NodemailerEmailProvider } from './nodemailer/nodemailerEmail.provider';
import { EmailProvider } from './emailProvider';
import { LoginByForgetPasswordController } from './controllers/loginByForgetPassword.controller';
import { SendEmailConfirmationController } from './controllers/sendEmailConfirmation.controller';
import { SendEmailForgetPasswordController } from './controllers/sendEmailForgetPassword.controller';
import { LoginByForgetPasswordUseCase } from './useCase/loginByForgetPassword.useCase';
import { SendEmailConfirmationUseCase } from './useCase/sendEmailConfirmation.useCase';
import { SendEmailForgetPasswordUseCase } from './useCase/sendEmailForgetPassword.useCase';
import { ConfirmAccountEmailController } from './controllers/confirmAccountEmail.controller';
import { ConfirmAccountEmailUseCase } from './useCase/confirmAccountEmail.useCase';

@Module({
  imports: [EnvModule, DatabaseModule, CryptographyModule],
  controllers: [
    ConfirmAccountEmailController,
    LoginByForgetPasswordController,
    SendEmailConfirmationController,
    SendEmailForgetPasswordController,
  ],
  providers: [
    {
      provide: EmailProvider,
      useClass: NodemailerEmailProvider,
    },
    ConfirmAccountEmailUseCase,
    LoginByForgetPasswordUseCase,
    SendEmailConfirmationUseCase,
    SendEmailForgetPasswordUseCase,
    AuthenticateUserUseCase,
  ],
  exports: [
    EmailProvider,
  ],
})
export class EmailModule {}
