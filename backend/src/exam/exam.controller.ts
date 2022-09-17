import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dto/output.dto';
import { CreateExamInput, CreateExamOutput } from 'src/dto/create-exam';
import { FindExamListBymeOutput as FindExamListBymeOutput } from 'src/dto/find-examList-by-me.dto';
import {
  FindQuestionListByExamIdInput,
  FindQuestionListByExamIdOutput,
} from 'src/dto/find-questionList-by-examId.dto';
import { ExamService } from './exam.service';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '시험 생성' })
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Post()
  async createExam(
    @GetUser() user,
    @Body() createExamInput: CreateExamInput,
  ): Promise<CreateExamOutput> {
    return this.examService.createExam(createExamInput, user);
  }

  @ApiOperation({ summary: '자기가 만든 시험 정보 가져오기' })
  @ApiResponse({ type: FindExamListBymeOutput })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async findExamListByme(@GetUser() user): Promise<FindExamListBymeOutput> {
    return this.examService.findExamListByme(user);
  }

  @ApiOperation({ summary: 'examId 갖고있는 모든 question 가져오기' })
  @ApiResponse({ type: FindQuestionListByExamIdOutput })
  @Role(['Any'])
  @Get(':examId/question')
  async findQuestionListByExamId(
    @Param() { examId }: FindQuestionListByExamIdInput,
  ): Promise<FindQuestionListByExamIdOutput> {
    return this.examService.findQuestionListByExamId(examId);
  }
}
