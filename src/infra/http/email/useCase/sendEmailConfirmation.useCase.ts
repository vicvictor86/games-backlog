import { Injectable } from '@nestjs/common';
import { emailConfirmationHTML } from '../templates/emailConfirmationHTML';
import { EmailProvider } from '../emailProvider';

interface SendEmailUseCaseRequest {
  userEmail: string;
  accessToken: string;
}

@Injectable()
export class SendEmailConfirmationUseCase {
  constructor(
    private emailProvider: EmailProvider,
  ) {}

  async execute({
    userEmail,
    accessToken,
  }: SendEmailUseCaseRequest): Promise<void> {
    const emailTemplate = emailConfirmationHTML(userEmail, accessToken);

    await this.emailProvider.sendEmail({
      subject: 'Confirmação de email',
      to: userEmail,
      html: emailTemplate,
    });
  }
}
