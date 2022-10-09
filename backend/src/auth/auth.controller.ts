import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { RegisterUserInput as RegisterUserInput } from 'src/dto/signup-user.dto';
import { LoginInput, LoginOutput } from 'src/dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '유저 생성' })
  @ApiResponse({ type: CoreOutput })
  @Post('/register')
  async createUser(
    @Body() createUserInput: RegisterUserInput,
  ): Promise<CoreOutput> {
    return this.authService.createUser(createUserInput);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ type: LoginOutput })
  @Post('/login')
  async login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
    return this.authService.login(loginInput);
  }
}
