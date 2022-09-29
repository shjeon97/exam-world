import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Question } from 'src/entity/question.entity';

export class FindQuestionListByExamIdInput {
  @ApiProperty({ description: 'question을 가져올 examId' })
  examId: number;
}

export class FindQuestionListByExamIdOutput extends CoreOutput {
  @ApiProperty({ description: 'question 리스트' })
  questionList?: Question[];
}
