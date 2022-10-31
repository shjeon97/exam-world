import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dto/output.dto';
import { PaginationInput } from 'src/common/dto/pagination.dto';
import { CreateExamInput, CreateExamOutput } from 'src/dto/create-exam';
import { DeleteExamByIdInput } from 'src/dto/delete-exam-by-id.dto';
import { DeleteExamLastPageByExamIdInput } from 'src/dto/delete-exam-lastPage-by-exmaId.dto';
import { EditExamInput } from 'src/dto/edit-exam.dto';
import { FindExamByIdInput } from 'src/dto/find-exam-by-id.dto';
import { FindExamListByMeOutput as FindExamListByMeOutput } from 'src/dto/find-examList-by-me.dto';
import {
  FindMultipleChoicesByExamIdInput,
  FindMultipleChoicesByExamIdOutput,
} from 'src/dto/find-multiple-choices-by-examId.dto';
import {
  FindQuestionsByExamIdInput,
  FindQuestionsByExamIdOutput,
} from 'src/dto/find-questions-by-examId.dto';
import { SearchExamOutput } from 'src/dto/search-exam.dto';
import { User } from 'src/entity/user.entity';
import { ExamService } from './exam.service';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '시험 생성' })
  @ApiBearerAuth('authorization')
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
  @ApiBearerAuth('authorization')
  @ApiResponse({ type: FindExamListByMeOutput })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async findExamListByMe(
    @GetUser() user: User,
  ): Promise<FindExamListByMeOutput> {
    return this.examService.findExamListByMe(user);
  }

  @ApiOperation({ summary: '시험 목록' })
  @ApiResponse({ type: SearchExamOutput })
  @Get('/search')
  async searchExam(
    @Query() searchExamInput: PaginationInput,
  ): Promise<SearchExamOutput> {
    return this.examService.searchExam(searchExamInput);
  }

  @ApiOperation({ summary: 'examId 갖고있는 모든 question 가져오기' })
  @ApiResponse({ type: FindQuestionsByExamIdOutput })
  @Get(':id/questions')
  async findQuestionListByExamId(
    @Param() { id }: FindQuestionsByExamIdInput,
  ): Promise<FindQuestionsByExamIdOutput> {
    return this.examService.findQuestionsByExamId(id);
  }

  @ApiOperation({ summary: 'examId 갖고있는 모든 multiple-choice 가져오기' })
  @ApiResponse({ type: FindMultipleChoicesByExamIdOutput })
  @Get(':id/multiple-choices')
  async findMultipleChoicesByExamId(
    @Param() { id }: FindMultipleChoicesByExamIdInput,
  ): Promise<FindMultipleChoicesByExamIdOutput> {
    return this.examService.findMultipleChoicesByExamId(id);
  }

  @ApiOperation({ summary: 'id로 시험 정보 가져오기' })
  @ApiResponse({ type: FindExamListByMeOutput })
  @Get(':id')
  async findExamById(@Param() { id }: FindExamByIdInput) {
    return this.examService.findExamById(id);
  }

  @ApiOperation({ summary: '시험 정보 수정' })
  @ApiBearerAuth('authorization')
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @Put()
  async editExam(@Body() editExamInput: EditExamInput): Promise<CoreOutput> {
    return this.examService.editExam(editExamInput);
  }

  @ApiOperation({ summary: '시험 마지막 페이지 (문제,보기) 삭제하기' })
  @ApiBearerAuth('authorization')
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Delete(':id/last-page')
  async deleteExamLastPage(
    @GetUser() user: User,
    @Param() { id }: DeleteExamLastPageByExamIdInput,
  ): Promise<CoreOutput> {
    return this.examService.deleteExamLastPage(user, id);
  }

  @ApiOperation({ summary: '시험 정보 삭제하기' })
  @ApiBearerAuth('authorization')
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteExamById(
    @GetUser() user: User,
    @Param() { id }: DeleteExamByIdInput,
  ): Promise<CoreOutput> {
    return this.examService.deleteExamById(user, id);
  }
}
