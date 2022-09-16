import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
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
  @PrimaryGeneratedColumn()
  examId: number;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  question: Question;

  @ApiProperty({ description: '문제 id' })
  @RelationId((multipleChoice: MultipleChoice) => multipleChoice.question)
  @PrimaryGeneratedColumn()
  questionId: number;

  @ApiProperty({ description: '시험 페이지 번호' })
  @PrimaryGeneratedColumn()
  no: number;

  @ApiProperty({ description: '시험 페이지 번호' })
  @Column()
  text: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '마지막 수정일' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: '삭제일' })
  @DeleteDateColumn()
  deletedAt: Date;
}
