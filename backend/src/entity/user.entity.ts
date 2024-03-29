import { InternalServerErrorException } from '@nestjs/common';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CoreEntity } from 'src/common/entity/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  User = 'User',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
}

@Entity()
export class User extends CoreEntity {
  @ApiProperty({
    example: UserRole.User,
    description: '권한',
    enum: UserRole,
  })
  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: '이메일', description: '1234@1234.com' })
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '닉네임', description: '홍길동' })
  @Column()
  @IsString()
  @MaxLength(10)
  @MinLength(2)
  nickname: string;

  @ApiProperty({ example: '비밀번호', description: 'password' })
  @Column({ select: false })
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({ example: '전화번호', description: '01011112222' })
  @Column({ nullable: true, unique: true })
  @IsString()
  phone?: string;

  @ApiProperty({ example: false, description: '인증' })
  @Column({ default: false })
  verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(password, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
