import { PickType } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';

export class SignupUserInput extends PickType(User, [
  'nickname',
  'password',
  'email',
] as const) {}
