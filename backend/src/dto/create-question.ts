import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Question } from 'src/entity/question.entity';

export class CreateQuestionInput extends PickType(Question, [
  'question',
  'examId',
  'page',
] as const) {}

export class CreateQuestionOutput extends CoreOutput {
  @ApiProperty({ description: 'questionId' })
  questionId?: number;
}
