import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dto/output.dto';
import { CreateExamInput } from 'src/dto/create-exam';
import { Exam } from 'src/entity/exam.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly exam: Repository<Exam>,
  ) {}

  async createExam(
    { name, title }: CreateExamInput,
    user: User,
  ): Promise<CoreOutput> {
    try {
      name = name.trim().replace('/', '-');
      title = title.trim().replace('/', '-');

      await this.exam.save(
        this.exam.create({
          name,
          title,
          user,
        }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);

      return { ok: false, error: '유저 생성 실패' };
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
}
