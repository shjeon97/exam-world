import { Controller } from '@nestjs/common';
import { MultipleChoiceService } from './multiple-choice.service';

@Controller('multiple-choice')
export class MultipleChoiceController {
  constructor(private readonly multipleChoiceService: MultipleChoiceService) {}
}
