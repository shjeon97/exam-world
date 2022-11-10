import { PickType } from '@nestjs/swagger';
import { Qna } from 'src/entity/qna.entity';

export class SendQuestionInput extends PickType(Qna, [
  'email',
  'title',
  'question',
] as const) {}
