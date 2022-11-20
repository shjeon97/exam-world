import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Verification } from 'src/entity/verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
