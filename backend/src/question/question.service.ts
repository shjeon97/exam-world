import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveQuestionInput, SaveQuestionOutput } from 'src/dto/save-question';
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

  async saveQuestion({
    text,
    examId,
    page,
    score,
  }: SaveQuestionInput): Promise<SaveQuestionOutput> {
    try {
      const exam = await this.exam.findOne({ where: { id: examId } });

      if (!exam) {
        return {
          ok: false,
          error: '존재하지 않는 시험 입니다.',
        };
      }

      await this.question.delete({ exam: { id: exam.id }, page });

      await this.question.save(
        this.question.create({
          exam,
          text,
          page,
          score,
        }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '문제 생성 실패',
      };
    }
  }
}
