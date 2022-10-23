import { PickType } from '@nestjs/swagger';
import { Exam } from 'src/entity/exam.entity';

export class EditExamInput extends PickType(Exam, [
  'id',
  'name',
  'title',
  'time',
] as const) {}
