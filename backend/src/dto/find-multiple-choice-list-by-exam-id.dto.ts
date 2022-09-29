import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { MultipleChoice } from 'src/entity/multiple-choice.entity';
import { Question } from 'src/entity/question.entity';

export class FindMultipleChoiceListByExamIdInput {
  @ApiProperty({ description: 'multiple Choice 가져올 examId' })
  examId: number;
}

export class FindMultipleChoiceListByExamIdOutput extends CoreOutput {
  @ApiProperty({ description: 'multiple Choice 리스트' })
  multipleChoiceList?: MultipleChoice[];
}
