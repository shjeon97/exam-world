import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from 'src/entity/exam.entity';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exam])],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}
