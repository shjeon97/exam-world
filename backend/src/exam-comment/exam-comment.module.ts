import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamComment } from 'src/entity/exam-comment.entity';
import { Exam } from 'src/entity/exam.entity';
import { User } from 'src/entity/user.entity';
import { ExamCommentController } from './exam-comment.controller';
import { ExamCommentService } from './exam-comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, User, ExamComment])],
  controllers: [ExamCommentController],
  providers: [ExamCommentService],
})
export class ExamCommentModule {}
