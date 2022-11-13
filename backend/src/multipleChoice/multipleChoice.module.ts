import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from 'src/entity/exam.entity';
import { MultipleChoice } from 'src/entity/multiple-choice.entity';
import { MultipleChoiceController } from './multipleChoice.controller';
import { MultipleChoiceService } from './multipleChoice.service';

@Module({
  imports: [TypeOrmModule.forFeature([MultipleChoice, Exam])],
  controllers: [MultipleChoiceController],
  providers: [MultipleChoiceService],
  exports: [MultipleChoiceService],
})
export class MultipleChoiceModule {}
