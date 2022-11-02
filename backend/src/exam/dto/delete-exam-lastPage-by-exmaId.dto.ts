import { ApiProperty } from '@nestjs/swagger';

export class DeleteExamLastPageByExamIdInput {
  @ApiProperty({
    description: '삭제할 시험 마지막 페이지의 ( 보기, 문항) examId',
  })
  id: number;
}
