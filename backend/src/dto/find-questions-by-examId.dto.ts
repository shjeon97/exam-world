import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Question } from 'src/entity/question.entity';

export class FindQuestionsByExamIdInput {
  @ApiProperty({ description: 'question을 가져올 examId' })
  id: number;
}

export class FindQuestionsByExamIdOutput extends CoreOutput {
  @ApiProperty({ description: 'question 리스트' })
  questions?: Question[];
}
