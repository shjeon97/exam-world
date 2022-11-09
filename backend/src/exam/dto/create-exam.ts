import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Exam } from 'src/entity/exam.entity';

export class CreateExamInput extends PickType(Exam, [
  'title',
  'description',
  'time',
  'minimumPassScore',
] as const) {}

export class CreateExamOutput extends CoreOutput {
  @ApiProperty({ description: 'examId' })
  examId?: number;
}
