import { PickType } from '@nestjs/swagger';
import { MultipleChoice } from 'src/entity/multiple-choice.entity';

export class DeleteMultipleChoiceListInput extends PickType(MultipleChoice, [
  'examId',
  'page',
] as const) {}
