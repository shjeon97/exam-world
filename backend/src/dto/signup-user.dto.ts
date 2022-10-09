import { PickType } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';

export class RegisterUserInput extends PickType(User, [
  'nickname',
  'password',
  'email',
] as const) {}
