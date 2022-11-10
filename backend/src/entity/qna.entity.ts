import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Qna extends CoreEntity {
  @ApiProperty({ example: '이메일', description: '1234@1234.com' })
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '제목', description: '@@이 문제.' })
  @Column()
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  title: string;

  @ApiProperty({ example: '문의내용', description: '@@이 작동하지 않습니다.' })
  @Column()
  @IsString()
  @MaxLength(10000)
  @MinLength(2)
  question: string;

  @ApiProperty({ example: '문의내용', description: '@@이 작동하지 않습니다.' })
  @Column({ nullable: true })
  @IsString()
  @MaxLength(10000)
  @MinLength(2)
  answer?: string;
}
