import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { MultipleChoice } from 'src/entity/multiple-choice.entity';

export class FindMultipleChoicesByExamIdInput {
  @ApiProperty({ description: 'multiple Choice 가져올 examId' })
  id: number;
}

export class FindMultipleChoicesByExamIdOutput extends CoreOutput {
  @ApiProperty({ description: 'multiple Choice 리스트' })
  multipleChoices?: MultipleChoice[];
}
