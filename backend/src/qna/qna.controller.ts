import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { SendQuestionInput } from 'src/qna/dto/send-question.dto';
import { QnaService } from './qna.service';

@Controller('qna')
export class QnaController {
  constructor(private readonly qnaService: QnaService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '문의사항 질문 전송' })
  @ApiResponse({ type: CoreOutput })
  @Post('/question')
  async sendQuestion(
    @Body() sendQuestionInput: SendQuestionInput,
  ): Promise<CoreOutput> {
    return this.qnaService.sendQuestion(sendQuestionInput);
  }
}
