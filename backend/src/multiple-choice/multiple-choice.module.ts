import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from 'src/entity/exam.entity';
import { MultipleChoice } from 'src/entity/multiple-choice.entity';
import { Question } from 'src/entity/question.entity';
import { MultipleChoiceController } from './multiple-choice.controller';
import { MultipleChoiceService } from './multiple-choice.service';

@Module({
  imports: [TypeOrmModule.forFeature([MultipleChoice, Exam])],
  controllers: [MultipleChoiceController],
  providers: [MultipleChoiceService],
})
export class MultipleChoiceModule {}
