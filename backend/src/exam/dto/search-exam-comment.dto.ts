import { ApiProperty } from '@nestjs/swagger';
import { PaginationOutput } from 'src/common/dto/pagination.dto';
import { ExamComment } from 'src/entity/exam-comment.entity';

export class SearchExamCommentInput {
  @ApiProperty({ description: 'exam comment를 가져올 examId' })
  id: number;
}

export class SearchExamCommentOutput extends PaginationOutput {
  @ApiProperty({ description: '시험 관련 댓글 리스트' })
  result?: ExamComment[];
}
