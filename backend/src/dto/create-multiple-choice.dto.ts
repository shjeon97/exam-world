import { PickType } from '@nestjs/swagger';
import { MultipleChoice } from 'src/entity/multiple-choice.entity';
import { Question } from 'src/entity/question.entity';

export class CreateMultipleChoiceInput extends PickType(MultipleChoice, [
  'examId',
  'text',
  'score',
  'no',
  'page',
] as const) {}
