import { ApiProperty } from '@nestjs/swagger';
import { PaginationOutput } from 'src/common/dto/pagination.dto';
import { Exam } from 'src/entity/exam.entity';

export class SearchExamOutput extends PaginationOutput {
  @ApiProperty({ description: '시험 리스트' })
  result?: Exam[];
}
