import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dto/output.dto';
import { CreateExamInput, CreateExamOutput } from 'src/dto/create-exam';
import { EditExamInput } from 'src/dto/edit-exam.dto';
import { FindMultipleChoiceListByExamIdOutput } from 'src/dto/find-multiple-choice-list-by-exam-id.dto';
import { FindQuestionListByExamIdOutput } from 'src/dto/find-question-list-by-exam-id.dto';
import { Exam } from 'src/entity/exam.entity';
import { MultipleChoice } from 'src/entity/multiple-choice.entity';
import { Question } from 'src/entity/question.entity';
import { User, UserRole } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly exam: Repository<Exam>,
    @InjectRepository(Question)
    private readonly question: Repository<Question>,
    @InjectRepository(MultipleChoice)
    private readonly multipleChoice: Repository<MultipleChoice>,
  ) {}

  async createExam(
    { name, title, time, minimumPassScore }: CreateExamInput,
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
          time,
          minimumPassScore,
        }),
      );

      return {
        ok: true,
        examId: id,
      };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '시험 생성 실패' };
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
      return { ok: false, error: 'id와 일치하는 시험 정보 가져오기 실패' };
    }
  }

  async editExam({ id, name, title, time, minimumPassScore }: EditExamInput) {
    try {
      const exam = await this.exam.findOne({ where: { id } });
      exam.name = name;
      exam.title = title;
      exam.time = time;
      exam.minimumPassScore = minimumPassScore;
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

  async findExamListByMe(user: any) {
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

  async allExamList() {
    try {
      const examList = await this.exam.find({
        relations: ['user'],
        order: { createdAt: 'asc' },
      });
      return {
        ok: true,
        examList,
      };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '모든 시험 정보 가져오기 실패' };
    }
  }

  async deleteExamById(user: User, id: number): Promise<CoreOutput> {
    try {
      const exam = await this.exam.findOne({ where: { id } });

      if (!exam) {
        return { ok: false, error: '존재하지 않는 시험 정보 입니다.' };
      }

      if (user.role === UserRole.User && user.id !== exam.userId) {
        return {
          ok: false,
          error: '다른 사용자가 만든 시험을 삭제하실 수 없습니다.',
        };
      }

      await this.exam.delete({ id: exam.id });

      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '시험 삭제 실패' };
    }
  }

  async deleteExamLastPage(user: User, examId: number): Promise<CoreOutput> {
    try {
      const exam = await this.exam.findOne({ where: { id: examId } });

      if (!exam) {
        return { ok: false, error: '존재하지 않는 시험 정보 입니다.' };
      }

      if (user.role === UserRole.User && user.id !== exam.userId) {
        return {
          ok: false,
          error: '다른 사용자가 만든 문항을 삭제하실 수 없습니다.',
        };
      }

      const { page } = await this.question.findOne({
        where: { exam: { id: examId } },
        order: { page: 'DESC' },
      });

      await this.question.delete({ exam: { id: exam.id }, page });

      await this.multipleChoice.delete({ exam: { id: exam.id }, page });

      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '마지막 문항 삭제 실패' };
    }
  }

  async findQuestionListByExamId(
    examId: number,
  ): Promise<FindQuestionListByExamIdOutput> {
    try {
      const questionList = await this.question.find({
        where: { exam: { id: examId } },
        order: { page: 'asc' },
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

  async findMultipleChoiceListByExamId(
    examId: number,
  ): Promise<FindMultipleChoiceListByExamIdOutput> {
    try {
      const multipleChoiceList = await this.multipleChoice.find({
        where: { exam: { id: examId } },
        order: { no: 'ASC' },
      });

      return {
        ok: true,
        multipleChoiceList,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'examId에 일치하는 multiple Choice list 가져오기 실패',
      };
    }
  }
}
