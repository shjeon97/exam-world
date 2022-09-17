import { PickType } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';

export class EditUserRoleInput extends PickType(User, ['role'] as const) {}
