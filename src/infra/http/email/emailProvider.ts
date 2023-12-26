export interface EmailContent {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

export abstract class EmailProvider {
  abstract sendEmail(emailContent: EmailContent): Promise<void>;
}
