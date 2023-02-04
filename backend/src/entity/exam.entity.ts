import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
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

  @ApiProperty({ example: '제목', description: '필기 시험' })
  @Column()
  @IsString()
  @MaxLength(30)
  @MinLength(2)
  title: string;

  @ApiProperty({
    example: '부가설명',
    description: '필기 시험입니다.',
  })
  @Column({ nullable: true })
  @IsString()
  @MaxLength(50)
  @MinLength(2)
  description?: string;

  @ApiProperty({
    example: '조회수',
    description: '0',
  })
  @Column({ default: 0 })
  @IsNumber()
  view: number;
  @ApiProperty({
    example: '제한시간',
    description: '1000',
  })
  @Column({ default: 0 })
  @IsNumber()
  time: number;

  @ApiProperty({
    example: '커트라인',
    description: '60',
  })
  @Column({ default: 0 })
  @IsNumber()
  minimumPassScore: number;
}
