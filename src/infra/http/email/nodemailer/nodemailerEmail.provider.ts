import * as nodemailer from 'nodemailer';
import { envSchema } from '@/infra/env/env';
import { Injectable } from '@nestjs/common';
import { EmailContent, EmailProvider } from '../emailProvider';

const env = envSchema.parse(process.env);

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: env.SECURE === 'true',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

@Injectable()
export class NodemailerEmailProvider implements EmailProvider {
  async sendEmail({
    to, subject, text, html,
  }: EmailContent): Promise<void> {
    await transporter.sendMail({
      from: `"Backlog" <${env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
  }
}
