import { PickType } from '@nestjs/swagger';
import { Verification } from 'src/entity/verification.entity';

export class VerifyEmailInput extends PickType(Verification, [
  'code',
] as const) {}
