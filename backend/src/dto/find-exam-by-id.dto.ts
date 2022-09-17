import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Exam } from 'src/entity/exam.entity';

export class FindExamByIdInput extends PickType(Exam, ['id']) {}

export class FindExamByIdOutput extends CoreOutput {
  @ApiProperty({ description: '시험정보' })
  exam?: Exam;
}
