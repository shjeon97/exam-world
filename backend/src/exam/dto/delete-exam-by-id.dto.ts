import { ApiProperty } from '@nestjs/swagger';

export class DeleteExamByIdInput {
  @ApiProperty({ description: '삭제할 시험 examId' })
  id: number;
}
