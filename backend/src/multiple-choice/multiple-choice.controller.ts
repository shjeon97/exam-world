import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dto/output.dto';
import { CreateMultipleChoiceInput } from 'src/dto/create-multiple-choice.dto';
import { MultipleChoiceService } from './multiple-choice.service';

@Controller('multiple-choice')
export class MultipleChoiceController {
  constructor(private readonly multipleChoiceService: MultipleChoiceService) {}
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '문제 생성' })
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @Post()
  async createQuestion(
    @Body() createMultipleChoiceInput: CreateMultipleChoiceInput,
  ): Promise<CoreOutput> {
    return this.multipleChoiceService.createMultipleChoice(
      createMultipleChoiceInput,
    );
  }
}
