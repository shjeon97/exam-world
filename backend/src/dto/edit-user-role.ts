import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from 'src/entity/user.entity';

export class EditUserRoleInput extends PickType(User, ['role'] as const) {}

export class EditUserRoleOutput extends CoreOutput {}
