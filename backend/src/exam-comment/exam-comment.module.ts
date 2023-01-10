import { Module } from '@nestjs/common';
import { ExamCommentController } from './exam-comment.controller';
import { ExamCommentService } from './exam-comment.service';

@Module({
  controllers: [ExamCommentController],
  providers: [ExamCommentService],
})
export class ExamCommentModule {}
