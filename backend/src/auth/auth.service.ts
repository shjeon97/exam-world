import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dto/output.dto';
import { LoginInput, LoginOutput } from 'src/auth/dto/login.dto';
import { SignupUserInput } from 'src/auth/dto/signup-user.dto';
import { User, UserRole } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  /** User 생성 */
  async createUser({
    nickname,
    password,
    email,
  }: SignupUserInput): Promise<CoreOutput> {
    try {
      nickname = nickname.trim().replace('/', '-');
      password = password.trim();
      email = email.trim();

      const existsNickname = await this.user.findOne({ where: { nickname } });

      if (existsNickname) {
        return { ok: false, error: '이미 존재하는 닉네임입니다.' };
      }

      const existsEmail = await this.user.findOne({ where: { email } });

      if (existsEmail) {
        return { ok: false, error: '이미 존재하는 이메일입니다.' };
      }

      await this.user.save(
        this.user.create({
          nickname,
          password,
          ...(email && { email }),
          role: UserRole.User,
        }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);

      return { ok: false, error: '유저 생성 실패' };
    }
  }

  /** 로그인 후 토큰 발행 */
  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      email = email.trim().replace('/', '-');
      password = password.trim();

      const user = await this.user.findOne({
        where: { email },
        select: ['id', 'password'],
      });

      if (!user) {
        return {
          ok: false,
          error:
            '등록되지 않은 이메일이거나, 이메일 또는 비밀번호를 잘못 입력하셨습니다.',
        };
      }

      // 비밀번호 일치하는지 확인
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error:
            '등록되지 않은 이메일이거나, 이메일 또는 비밀번호를 잘못 입력하셨습니다.',
        };
      }

      const payload = { id: user.id };
      const token = this.jwtService.sign(payload);

      return {
        ok: true,
        token,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '로그인 실패',
      };
    }
  }
}
