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
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.decorator';
import { CreateUserInput, CreateUserOutput } from 'src/dto/create-user.dto';
import { LoginInput, LoginOutput } from 'src/dto/login.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '내 정보' })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  me(@GetUser() user) {
    return user;
  }
}
