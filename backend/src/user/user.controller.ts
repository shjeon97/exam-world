import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dto/output.dto';
import { DeleteMeInput } from 'src/dto/delete-me.dto';
import { EditMeInput } from 'src/dto/edit-me.dto';
import { User } from 'src/entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '내 정보' })
  @ApiBearerAuth('authorization')
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '내 정보 수정' })
  @ApiBearerAuth('authorization')
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Put('/me')
  editMe(
    @GetUser() user: User,
    @Body() editUserInput: EditMeInput,
  ): Promise<CoreOutput> {
    return this.userService.editMe(user, editUserInput);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '내 계정 삭제' })
  @ApiBearerAuth('authorization')
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  deleteMe(
    @GetUser() user: User,
    @Body() deleteUserInput: DeleteMeInput,
  ): Promise<CoreOutput> {
    return this.userService.deleteMe(user, deleteUserInput);
  }
}
