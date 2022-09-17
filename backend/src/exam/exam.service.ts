import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dto/output.dto';
import { CreateExamInput, CreateExamOutput } from 'src/dto/create-exam';
import { EditExamInput } from 'src/dto/edit-exam.dto';
import { FindQuestionListByExamIdOutput } from 'src/dto/find-questionList-by-examId.dto';
import { Exam } from 'src/entity/exam.entity';
import { Question } from 'src/entity/question.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly exam: Repository<Exam>,
    @InjectRepository(Question)
    private readonly question: Repository<Question>,
  ) {}

  async createExam(
    { name, title }: CreateExamInput,
    user: User,
  ): Promise<CreateExamOutput> {
    try {
      name = name.trim().replace('/', '-');
      title = title.trim().replace('/', '-');

      const { id } = await this.exam.save(
        this.exam.create({
          name,
          title,
          user,
        }),
      );

      return {
        ok: true,
        examId: id,
      };
    } catch (error) {
      console.log(error);

      return { ok: false, error: '유저 생성 실패' };
    }
  }

  async findExamById(id: number) {
    try {
      const exam = await this.exam.findOne({
        where: { id },
      });
      return {
        ok: true,
        exam,
      };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '내가 만든 시험 정보 가져오기 실패' };
    }
  }

  async editExam({ id, name, title }: EditExamInput) {
    try {
      const exam = await this.exam.findOne({ where: { id } });
      exam.name = name;
      exam.title = title;

      await this.exam.save(exam);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);

      return {
        ok: false,
        error: '시험 정보 수정 실패',
      };
    }
  }

  async findExamListByme(user: any) {
    try {
      const examList = await this.exam.find({
        where: { user: { id: user.id } },
        relations: ['user'],
      });
      return {
        ok: true,
        examList,
      };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '내가 만든 시험 정보 가져오기 실패' };
    }
  }

  async findQuestionListByExamId(
    examId: number,
  ): Promise<FindQuestionListByExamIdOutput> {
    try {
      const questionList = await this.question.find({
        where: { exam: { id: examId } },
      });
      return {
        ok: true,
        questionList,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'examId에 일치하는 question list 가져오기 실패',
      };
    }
  }
}
