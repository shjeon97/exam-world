import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';

@Entity()
export class Verification extends CoreEntity {
  @ApiProperty({
    example: 'verification code',
    description: '인증코드',
  })
  @Column()
  @IsString()
  code: string;

  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = uuid();
  }
}
