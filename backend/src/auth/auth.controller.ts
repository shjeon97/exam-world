import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserInput, CreateUserOutput } from 'src/dto/create-user.dto';
import { LoginInput, LoginOutput } from 'src/dto/login.dto';
import { AuthService } from './auth.service';
import { User } from './get-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role } from './role.decorator';

@Controller('api/auth')
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

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ type: LoginOutput })
  @Post('/login')
  async login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
    return this.authService.login(loginInput);
  }

  @ApiOperation({ summary: '토큰 테스트' })
  //   @Role(['Admin'])
  @UseGuards(JwtAuthGuard)
  @Post('test')
  test(@User() user) {
    console.log(user);
  }
}
