import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Question } from 'src/entity/question.entity';

export class CreateQuestionInput extends PickType(Question, [
  'text',
  'examId',
  'page',
  'score',
] as const) {}

export class CreateQuestionOutput extends CoreOutput {
  @ApiProperty({ description: 'questionId' })
  questionId?: number;
}
