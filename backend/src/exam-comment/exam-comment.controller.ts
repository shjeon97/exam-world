import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { CreateExamCommentInput } from './dto/create-exam-comment';
import { ExamCommentService } from './exam-comment.service';

@Controller('exam-comment')
export class ExamCommentController {
  constructor(private readonly examCommentService: ExamCommentService) {}

  @ApiOperation({ summary: '시험관련 댓글 추가' })
  @ApiResponse({ type: CoreOutput })
  @Post()
  async createExamComment(
    @Body() createExamCommentInput: CreateExamCommentInput,
  ): Promise<CoreOutput> {
    return this.examCommentService.createExamComment(createExamCommentInput);
  }
}
