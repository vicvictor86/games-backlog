import { Public } from '@/infra/auth/public';
import {
  Controller, HttpCode, Post, Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SendEmailForgetPasswordUseCase } from '../useCase/sendEmailForgetPassword.useCase';

@ApiTags('Email')
@Controller('/users/email/:userEmail/forget-password')
export class SendEmailForgetPasswordController {
  constructor(
    private sendEmailForgetPasswordUseCase: SendEmailForgetPasswordUseCase,
  ) {}

  @Post()
  @HttpCode(204)
  @Public()
  async handle(@Param('userEmail') userEmail: string) {
    this.sendEmailForgetPasswordUseCase.execute({
      userEmail,
    });
  }
}
