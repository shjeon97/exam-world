import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dto/output.dto';
import { CreateQuestionInput } from 'src/dto/create-question';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '문제 생성' })
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @Post()
  async createExam(
    @Body() createQuestionInput: CreateQuestionInput,
  ): Promise<CoreOutput> {
    return this.questionService.createQuestion(createQuestionInput);
  }
}
