import { PickType } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';

export class SignupUserInput extends PickType(User, [
  'name',
  'password',
  'email',
] as const) {}
