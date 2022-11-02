import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dto/output.dto';
import { SaveMultipleChoiceInput as SaveMultipleChoiceInput } from 'src/multipleChoice/dto/save-multipleChoice.dto';
import { DeleteMultipleChoicesByExamIdAndPageInput } from 'src/multipleChoice/dto/delete-multipleChoice.dto';
import { MultipleChoiceService } from './multipleChoice.service';

@Controller()
export class MultipleChoiceController {
  constructor(private readonly multipleChoiceService: MultipleChoiceService) {}
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '보기 저장 (생성, 변경)' })
  @ApiBearerAuth('authorization')
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @Post('multiple-choice')
  async saveMultipleChoice(
    @Body() saveMultipleChoiceInput: SaveMultipleChoiceInput,
  ): Promise<CoreOutput> {
    return this.multipleChoiceService.saveMultipleChoice(
      saveMultipleChoiceInput,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'examId, page 정보와 일치하는 보기 모두 삭제' })
  @ApiResponse({ type: CoreOutput })
  @ApiBearerAuth('authorization')
  @Role(['Any'])
  @Delete('multiple-choices')
  async deleteMultipleChoicesByExamIdAndPage(
    @Body()
    deleteMultipleChoicesByExamIdAndPageInput: DeleteMultipleChoicesByExamIdAndPageInput,
  ): Promise<CoreOutput> {
    return this.multipleChoiceService.deleteMultipleChoicesByExamIdAndPage(
      deleteMultipleChoicesByExamIdAndPageInput,
    );
  }
}
