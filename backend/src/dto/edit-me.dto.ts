import { PickType } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';

export class EditMeInput extends PickType(User, [
  'email',
  'nickname',
  'password',
] as const) {
  editPassword?: string;
}
