import { PickType } from '@nestjs/swagger';
import { Question } from 'src/entity/question.entity';

export class CreateQuestionInput extends PickType(Question, [
  'question',
  'examId',
  'page',
] as const) {}
