import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  Body,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dto/output.dto';
import { DeleteMeInput } from 'src/dto/delete-me.dto';
import { EditMeInput } from 'src/dto/edit-me.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '내 정보' })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getMe(@GetUser() user) {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '내 정보 수정' })
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  editMe(
    @GetUser() user,
    @Body() editUserInput: EditMeInput,
  ): Promise<CoreOutput> {
    return this.userService.editMe(user, editUserInput);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '내 계정 삭제' })
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  deleteMe(
    @GetUser() user,
    @Body() deleteUserInput: DeleteMeInput,
  ): Promise<CoreOutput> {
    return this.userService.deleteMe(user, deleteUserInput);
  }
}
