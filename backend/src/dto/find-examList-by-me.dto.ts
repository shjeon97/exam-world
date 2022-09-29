import { CoreOutput } from 'src/common/dto/output.dto';
import { Exam } from 'src/entity/exam.entity';

export class FindExamListByMeOutput extends CoreOutput {
  examList?: Exam[];
}
