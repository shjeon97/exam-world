import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dto/output.dto';
import { PaginationInput } from 'src/common/dto/pagination.dto';
import { CreateExamInput, CreateExamOutput } from 'src/exam/dto/create-exam';
import { EditExamInput } from 'src/exam/dto/edit-exam.dto';
import { FindMultipleChoicesByExamIdOutput } from 'src/exam/dto/find-multipleChoices-by-examId.dto';
import { FindQuestionsByExamIdOutput } from 'src/exam/dto/find-questions-by-examId.dto';
import { SearchExamOutput } from 'src/exam/dto/search-exam.dto';
import { Exam } from 'src/entity/exam.entity';
import { MultipleChoice } from 'src/entity/multiple-choice.entity';
import { Question } from 'src/entity/question.entity';
import { User, UserRole } from 'src/entity/user.entity';
import { ILike, Repository } from 'typeorm';
import { ExamComment } from 'src/entity/exam-comment.entity';
import { SearchExamCommentOutput } from './dto/search-exam-comment.dto';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly exam: Repository<Exam>,
    @InjectRepository(Question)
    private readonly question: Repository<Question>,
    @InjectRepository(MultipleChoice)
    private readonly multipleChoice: Repository<MultipleChoice>,
    @InjectRepository(ExamComment)
    private readonly examComment: Repository<ExamComment>,
  ) {}

  async createExam(
    {
      title: name,
      description: title,
      time,
      minimumPassScore,
    }: CreateExamInput,
    user: User,
  ): Promise<CreateExamOutput> {
    try {
      name = name.trim().replace('/', '-');
      title = title.trim().replace('/', '-');

      if (!user.verified) {
        return {
          ok: false,
          error: '해당기능은 이메일 인증이 필요합니다.',
        };
      }
      const { id } = await this.exam.save(
        this.exam.create({
          title: name,
          description: title,
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

      exam.view = exam.view + 1;

      await this.exam.save(exam);

      return {
        ok: true,
        exam,
      };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'id와 일치하는 시험 정보 가져오기 실패' };
    }
  }

  async editExam({
    id,
    title,
    description,
    time,
    minimumPassScore,
  }: EditExamInput) {
    try {
      const exam = await this.exam.findOne({ where: { id } });
      exam.title = title;
      exam.description = description;
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

  async searchExamsByMe(
    user: any,
    { page, 'page-size': pageSize, type, value }: PaginationInput,
  ): Promise<SearchExamOutput> {
    try {
      const [exams, totalResult] = await this.exam.findAndCount({
        ...(type && value
          ? {
              where: {
                user: { id: user.id },
                [type]: ILike(`%${value.trim()}%`),
              },
            }
          : {
              where: {
                user: { id: user.id },
              },
            }),
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: {
          createdAt: 'DESC',
        },
        relations: ['user'],
      });

      return {
        ok: true,
        result: exams,
        totalPage: Math.ceil(totalResult / pageSize),
        totalResult,
      };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '내가 만든 시험 정보 가져오기 실패' };
    }
  }

  async searchExam({
    page,
    'page-size': pageSize,
    type,
    value,
    sort,
  }: PaginationInput): Promise<SearchExamOutput> {
    try {
      const [exams, totalResult] = await this.exam.findAndCount({
        ...(type &&
          value && {
            where: { [type]: ILike(`%${value.trim()}%`) },
          }),
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: {
          ...(sort && { [sort]: 'DESC' }),
        },
        relations: ['user'],
      });
      return {
        ok: true,
        result: exams,
        totalPage: Math.ceil(totalResult / pageSize),
        totalResult,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '시험정보 가져오기 실패',
      };
    }
  }

  async searchExamComment(
    { page, 'page-size': pageSize, sort }: PaginationInput,
    id: number,
  ): Promise<SearchExamCommentOutput> {
    try {
      const [examComments, totalResult] = await this.examComment.findAndCount({
        where: { exam: { id } },
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: {
          id: 'DESC',
          ...(sort && { [sort]: 'DESC' }),
        },
        relations: ['user'],
      });

      return {
        ok: true,
        result: examComments,
        totalPage: Math.ceil(totalResult / pageSize),
        totalResult,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '시험관련 댓글 정보 가져오기 실패',
      };
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

  async findQuestionsByExamId(
    id: number,
  ): Promise<FindQuestionsByExamIdOutput> {
    try {
      const questions = await this.question.find({
        where: { exam: { id } },
        order: { page: 'asc' },
      });
      return {
        ok: true,
        questions,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'examId에 일치하는 question list 가져오기 실패',
      };
    }
  }

  async findMultipleChoicesByExamId(
    id: number,
  ): Promise<FindMultipleChoicesByExamIdOutput> {
    try {
      const multipleChoices = await this.multipleChoice.find({
        where: { exam: { id } },
        order: { no: 'ASC' },
      });

      return {
        ok: true,
        multipleChoices,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'examId에 일치하는 multiple Choices 가져오기 실패',
      };
    }
  }
}
