import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dto/output.dto';
import { CreateQuestionInput } from 'src/dto/create-question';
import { Exam } from 'src/entity/exam.entity';
import { Question } from 'src/entity/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly question: Repository<Question>,
    @InjectRepository(Exam)
    private readonly exam: Repository<Exam>,
  ) {}

  async createQuestion({
    question,
    examId,
    page,
  }: CreateQuestionInput): Promise<CoreOutput> {
    try {
      const exam = await this.exam.findOne({ where: { id: examId } });

      if (!exam) {
        return {
          ok: false,
          error: '존재하지 않는 시험 입니다.',
        };
      }

      await this.question.save(
        await this.question.create({
          exam,
          question,
          page,
        }),
      );
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '문제 생성 실패',
      };
    }
  }
}
