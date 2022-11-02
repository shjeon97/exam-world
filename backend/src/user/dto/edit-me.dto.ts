import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';

export class EditMeInput extends PickType(User, [
  'email',
  'nickname',
  'password',
] as const) {
  @ApiProperty({ example: '변경할 비밀번호', description: 'editPassword' })
  editPassword?: string;
}
