import { Injectable } from '@nestjs/common';
import { EmailProvider } from '../emailProvider';
import { emailForgetPasswordHTML } from '../templates/emailForgetPasswordHTML';

interface SendEmailForgetPasswordUseCaseRequest {
  userEmail: string;
}

@Injectable()
export class SendEmailForgetPasswordUseCase {
  constructor(
    private emailProvider: EmailProvider,
  ) {}

  async execute({
    userEmail,
  }: SendEmailForgetPasswordUseCaseRequest): Promise<void> {
    const emailTemplate = emailForgetPasswordHTML(userEmail);

    await this.emailProvider.sendEmail({
      subject: 'Esqueci minha senha',
      to: userEmail,
      html: emailTemplate,
    });
  }
}
