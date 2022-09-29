import { PickType } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';

export class DeleteMeInput extends PickType(User, ['password'] as const) {}
