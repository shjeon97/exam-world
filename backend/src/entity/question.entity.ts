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

@Entity()
export class Question {
  @ManyToOne(() => Exam, { onDelete: 'CASCADE' })
  exam: Exam;

  @ApiProperty({ description: '시험 id' })
  @RelationId((question: Question) => question.exam)
  @PrimaryGeneratedColumn()
  examId: number;

  @ApiProperty({ description: '시험 페이지 번호' })
  @PrimaryGeneratedColumn()
  page: number;

  @ApiProperty({ description: '시험 문제' })
  @Column()
  question: string;

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
