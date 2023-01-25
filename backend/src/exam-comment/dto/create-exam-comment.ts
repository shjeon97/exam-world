import { PickType } from '@nestjs/swagger';
import { ExamComment } from 'src/entity/exam-comment.entity';

export class CreateExamCommentInput extends PickType(ExamComment, [
  'examId',
  'userId',
  'text',
] as const) {}
