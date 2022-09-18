import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from 'src/entity/exam.entity';
import { Question } from 'src/entity/question.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Exam])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
