import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dto/output.dto';
import {
  SaveQuestionInput,
  SaveQuestionOutput,
} from 'src/question/dto/save-question';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '문제 저장 (생성,변경)' })
  @ApiBearerAuth('authorization')
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @Post()
  async saveQuestion(
    @Body() saveQuestionInput: SaveQuestionInput,
  ): Promise<SaveQuestionOutput> {
    return this.questionService.saveQuestion(saveQuestionInput);
  }
}
