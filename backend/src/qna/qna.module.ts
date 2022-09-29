import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Qna } from 'src/entity/qna.entity';
import { QnaController } from './qna.controller';
import { QnaService } from './qna.service';

@Module({
  imports: [TypeOrmModule.forFeature([Qna])],
  controllers: [QnaController],
  providers: [QnaService],
})
export class QnaModule {}
