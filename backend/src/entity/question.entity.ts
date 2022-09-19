import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entity/core.entity';
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

@Entity()
export class Question {
  @ManyToOne(() => Exam, { onDelete: 'CASCADE' })
  exam: Exam;

  @ApiProperty({ description: '시험 id' })
  @RelationId((question: Question) => question.exam)
  @PrimaryColumn()
  examId: number;

  @ApiProperty({ description: '시험 페이지 번호' })
  @PrimaryColumn()
  page: number;

  @ApiProperty({ description: '시험 문제' })
  @Column()
  question: string;
}
