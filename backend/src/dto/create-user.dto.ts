import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from 'src/entity/user.entity';

export class CreateUserInput extends PickType(User, [
  'name',
  'password',
  'email',
] as const) {}

export class CreateUserOutput extends CoreOutput {}
