import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { Verification } from 'src/entity/verification.entity';
import { User } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  providers: [VerificationService],
  controllers: [VerificationController],
})
export class VerificationModule {}
