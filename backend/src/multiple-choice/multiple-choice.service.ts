import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dto/output.dto';
import { SaveMultipleChoiceInput as saveMultipleChoiceInput } from 'src/dto/save-multiple-choice.dto';
import { DeleteMultipleChoicesByExamIdAndPageInput } from 'src/dto/delete-multiple-choice.dto';
import { Exam } from 'src/entity/exam.entity';
import { MultipleChoice } from 'src/entity/multiple-choice.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MultipleChoiceService {
  constructor(
    @InjectRepository(MultipleChoice)
    private readonly multipleChoice: Repository<MultipleChoice>,
    @InjectRepository(Exam)
    private readonly exam: Repository<Exam>,
  ) {}

  async saveMultipleChoice({
    examId,
    no,
    text,
    isCorrectAnswer,
    page,
  }: saveMultipleChoiceInput): Promise<CoreOutput> {
    try {
      const exam = await this.exam.findOne({ where: { id: +examId } });

      if (!exam) {
        return {
          ok: false,
          error: '존재하지 않는 시험 입니다.',
        };
      }

      await this.multipleChoice.save(
        this.multipleChoice.create({
          exam,
          no,
          text,
          isCorrectAnswer,
          page,
        }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '보기 생성 실패',
      };
    }
  }

  async deleteMultipleChoicesByExamIdAndPage({
    examId,
    page,
  }: DeleteMultipleChoicesByExamIdAndPageInput): Promise<CoreOutput> {
    try {
      const exam = await this.exam.findOne({ where: { id: +examId } });

      if (!exam) {
        return {
          ok: false,
          error: '존재하지 않는 시험 입니다.',
        };
      }

      await this.multipleChoice.delete({ exam: { id: exam.id }, page });

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '보기 리스트 삭제 실패',
      };
    }
  }
}
