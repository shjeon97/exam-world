import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dto/output.dto';
import { ExamComment } from 'src/entity/exam-comment.entity';
import { Exam } from 'src/entity/exam.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateExamCommentInput } from './dto/create-exam-comment';

@Injectable()
export class ExamCommentService {
  constructor(
    @InjectRepository(Exam)
    private readonly exam: Repository<Exam>,
    @InjectRepository(User)
    private readonly user: Repository<User>,
    @InjectRepository(ExamComment)
    private readonly examComment: Repository<ExamComment>,
  ) {}
  async createExamComment({
    text,
    userId,
    examId,
  }: CreateExamCommentInput): Promise<CoreOutput> {
    {
      try {
        const exam = await this.exam.findOne({ where: { id: examId } });
        if (!exam) {
          return {
            ok: false,
            error: '존재하지 않는 시험입니다.',
          };
        }
        const user = await this.user.findOne({ where: { id: userId } });
        if (!user) {
          return {
            ok: false,
            error: '존재하지 않는 유저입니다.',
          };
        }

        await this.examComment.save(
          this.examComment.create({
            user,
            exam,
            text,
          }),
        );

        return {
          ok: true,
        };
      } catch (error) {
        console.log(error);

        return {
          ok: false,
          error: '시험관련 댓글 추가 실패',
        };
      }
    }
  }
}
