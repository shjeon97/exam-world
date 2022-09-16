import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultipleChoice } from 'src/entity/multiple-choice.entity';
import { MultipleChoiceController } from './multiple-choice.controller';
import { MultipleChoiceService } from './multiple-choice.service';

@Module({
  imports: [TypeOrmModule.forFeature([MultipleChoice])],
  controllers: [MultipleChoiceController],
  providers: [MultipleChoiceService],
})
export class MultipleChoiceModule {}
