import { CoreOutput } from 'src/common/dto/output.dto';
import { Exam } from 'src/entity/exam.entity';

export class AllExamListOutput extends CoreOutput {
  examList?: Exam[];
}
