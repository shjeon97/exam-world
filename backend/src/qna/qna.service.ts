import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dto/output.dto';
import { SendQuestionInput } from 'src/dto/send-question.dto';
import { Qna } from 'src/entity/qna.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QnaService {
  constructor(
    @InjectRepository(Qna)
    private readonly qna: Repository<Qna>,
  ) {}

  async sendQuestion({
    email,
    question,
  }: SendQuestionInput): Promise<CoreOutput> {
    try {
      await this.qna.save(
        this.qna.create({
          email,
          question,
        }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);

      return {
        ok: false,
        error: '문의사항 전송 실패',
      };
    }
  }
}
