import { PickType } from '@nestjs/swagger';
import { Exam } from 'src/entity/exam.entity';

export class CreateExamInput extends PickType(Exam, [
  'name',
  'title',
] as const) {}
