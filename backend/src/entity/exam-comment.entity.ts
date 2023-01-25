import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Exam } from './exam.entity';
import { User } from './user.entity';

@Entity()
export class ExamComment extends CoreEntity {
  @ManyToOne(() => Exam, { onDelete: 'CASCADE' })
  exam: Exam;

  @ApiProperty({ description: '시험 id' })
  examId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ description: '유저 id' })
  userId: number;

  @ApiProperty({ description: '좋아요' })
  @Column({ default: 0 })
  like: number;

  @ApiProperty({ description: '내용' })
  @Column()
  text: string;
}
