import { PickType } from '@nestjs/swagger';
import { MultipleChoice } from 'src/entity/multiple-choice.entity';

export class CreateMultipleChoiceInput extends PickType(MultipleChoice, [
  'examId',
  'text',
  'isCorrectAnswer',
  'no',
  'page',
] as const) {}
