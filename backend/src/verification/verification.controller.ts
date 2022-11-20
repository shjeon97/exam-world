import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { VerifyEmailInput } from './dto/verify-email.dto';
import { VerificationService } from './verification.service';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '유저 이메일 인증' })
  @ApiResponse({ type: CoreOutput })
  @Post('/email')
  async verifyEmail(
    @Body() verifyEmailInput: VerifyEmailInput,
  ): Promise<CoreOutput> {
    return this.verificationService.verifyEmail(verifyEmailInput);
  }
}
