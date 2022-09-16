import { IsString, MaxLength, MinLength } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity()
export class Exam extends CoreEntity {
  @ManyToOne(() => User)
  user: User;

  @ApiProperty({ description: '유저 id' })
  @RelationId((exam: Exam) => exam.user)
  userId: number;

  @ApiProperty({ example: '제목', description: '운전 2종 자동' })
  @Column()
  @IsString()
  @MaxLength(30)
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: '부가설명',
    description: '운전 2종 자동 필기 시험입니다.',
  })
  @Column({ nullable: true })
  @IsString()
  @MaxLength(30)
  @MinLength(2)
  title?: string;
}
