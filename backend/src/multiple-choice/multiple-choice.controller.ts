import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dto/output.dto';
import { SaveMultipleChoiceInput as SaveMultipleChoiceInput } from 'src/dto/save-multiple-choice.dto';
import { DeleteMultipleChoiceListInput } from 'src/dto/delete-multiple-choice.dto';
import { MultipleChoiceService } from './multiple-choice.service';

@Controller('multiple-choice')
export class MultipleChoiceController {
  constructor(private readonly multipleChoiceService: MultipleChoiceService) {}
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '보기 저장 (생성, 변경)' })
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @Post()
  async saveMultipleChoice(
    @Body() saveMultipleChoiceInput: SaveMultipleChoiceInput,
  ): Promise<CoreOutput> {
    return this.multipleChoiceService.saveMultipleChoice(
      saveMultipleChoiceInput,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '보기 list 삭제' })
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @Delete()
  async deleteMultipleChoiceList(
    @Body() deleteMultipleChoiceListInput: DeleteMultipleChoiceListInput,
  ): Promise<CoreOutput> {
    return this.multipleChoiceService.deleteMultipleChoiceList(
      deleteMultipleChoiceListInput,
    );
  }
}
