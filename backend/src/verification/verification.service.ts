import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from 'src/entity/user.entity';
import { Verification } from 'src/entity/verification.entity';
import { Repository } from 'typeorm';
import { VerifyEmailInput } from './dto/verify-email.dto';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    @InjectRepository(Verification)
    private readonly verification: Repository<Verification>,
  ) {}

  async verifyEmail({ code }: VerifyEmailInput): Promise<CoreOutput> {
    try {
      console.log(code);

      const verification = await this.verification.findOne({
        where: { code },
        relations: ['user'],
      });
      if (verification) {
        verification.user.verified = true;
        this.user.save(verification.user);
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: '존재하지 않는 인증코드입니다.',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '이메일 인증 실패',
      };
    }
  }
}
