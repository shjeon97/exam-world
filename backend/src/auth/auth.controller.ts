import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserInput, CreateUserOutput } from 'src/dto/create-user.dto';
import { LoginInput, LoginOutput } from 'src/dto/login.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from './role.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '유저 생성' })
  @ApiResponse({ type: CreateUserOutput })
  @Post('/signup')
  async createUser(
    @Body() createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.authService.createUser(createUserInput);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ type: LoginOutput })
  @Post('/login')
  async login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
    return this.authService.login(loginInput);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '내 정보' })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@GetUser() user) {
    return user;
  }
}
