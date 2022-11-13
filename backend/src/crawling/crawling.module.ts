import { Module } from '@nestjs/common';
import { ExamModule } from 'src/exam/exam.module';
import { MultipleChoiceModule } from 'src/multipleChoice/multipleChoice.module';
import { QuestionModule } from 'src/question/question.module';
import { CrawlingController } from './crawling.controller';
import { CrawlingService } from './crawling.service';

@Module({
  imports: [ExamModule, QuestionModule, MultipleChoiceModule],
  controllers: [CrawlingController],
  providers: [CrawlingService],
})
export class CrawlingModule {}
