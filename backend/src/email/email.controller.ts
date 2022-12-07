import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/entity/user.entity';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @ApiOperation({ summary: '인증 이메일 재전송' })
  @ApiBearerAuth('authorization')
  @Get('resend')
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  async sendEmail(@GetUser() user: User) {
    return this.emailService.resendEmail(user);
  }
}
