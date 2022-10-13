import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dto/output.dto';
import { AllExamListOutput } from 'src/dto/all-exam-list.dto';
import { CreateExamInput, CreateExamOutput } from 'src/dto/create-exam';
import { EditExamInput } from 'src/dto/edit-exam.dto';
import { FindExamByIdInput } from 'src/dto/find-exam-by-id.dto';
import { FindExamListByMeOutput as FindExamListByMeOutput } from 'src/dto/find-examList-by-me.dto';
import {
  FindMultipleChoiceListByExamIdInput,
  FindMultipleChoiceListByExamIdOutput,
} from 'src/dto/find-multiple-choice-list-by-exam-id.dto';
import {
  FindQuestionListByExamIdInput,
  FindQuestionListByExamIdOutput,
} from 'src/dto/find-question-list-by-exam-id.dto';
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
  @ApiResponse({ type: FindExamListByMeOutput })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async findExamListByme(@GetUser() user): Promise<FindExamListByMeOutput> {
    return this.examService.findExamListByMe(user);
  }

  @ApiOperation({ summary: '모든 시험 정보 가져오기' })
  @ApiResponse({ type: AllExamListOutput })
  @Get('/all')
  async allExamList(): Promise<AllExamListOutput> {
    return this.examService.allExamList();
  }

  @ApiOperation({ summary: 'examId 갖고있는 모든 question 가져오기' })
  @ApiResponse({ type: FindQuestionListByExamIdOutput })
  @Get(':examId/question')
  async findQuestionListByExamId(
    @Param() { examId }: FindQuestionListByExamIdInput,
  ): Promise<FindQuestionListByExamIdOutput> {
    return this.examService.findQuestionListByExamId(examId);
  }

  @ApiOperation({ summary: 'examId 갖고있는 모든 multiple-choice 가져오기' })
  @ApiResponse({ type: FindMultipleChoiceListByExamIdOutput })
  @Get(':examId/multiple-choice')
  async findMultipleChoiceListByExamId(
    @Param() { examId }: FindMultipleChoiceListByExamIdInput,
  ): Promise<FindMultipleChoiceListByExamIdOutput> {
    return this.examService.findMultipleChoiceListByExamId(examId);
  }

  @ApiOperation({ summary: 'id로 시험 정보 가져오기' })
  @ApiResponse({ type: FindExamListByMeOutput })
  @Get(':id')
  async findExamById(@Param() { id }: FindExamByIdInput) {
    return this.examService.findExamById(id);
  }

  @ApiOperation({ summary: 'id로 시험 정보 수정' })
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @Patch()
  async editExam(@Body() editExamInput: EditExamInput): Promise<CoreOutput> {
    return this.examService.editExam(editExamInput);
  }

  @ApiOperation({ summary: '시험 정보 삭제하기' })
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteExamById(
    @GetUser() user,
    @Param() { id }: { id: number },
  ): Promise<CoreOutput> {
    return this.examService.deleteExamById(user, id);
  }
}
