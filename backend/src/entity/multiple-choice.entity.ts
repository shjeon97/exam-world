import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { Exam } from './exam.entity';
import { Question } from './question.entity';

@Entity()
export class MultipleChoice {
  @ManyToOne(() => Exam, { onDelete: 'CASCADE' })
  exam: Exam;

  @ApiProperty({ description: '시험 id' })
  @RelationId((multipleChoice: MultipleChoice) => multipleChoice.exam)
  @PrimaryColumn()
  examId: number;

  @ApiProperty({ description: '시험 페이지 번호' })
  @PrimaryColumn()
  page: number;

  @ApiProperty({ description: '보기 번호' })
  @PrimaryColumn()
  no: number;

  @ApiProperty({ description: '보기 내용' })
  @Column()
  text: string;

  @ApiProperty({ description: '점수' })
  score: number;
}
