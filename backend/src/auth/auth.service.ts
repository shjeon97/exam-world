import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInput, CreateUserOutput } from 'src/dto/create-user.dto';
import { LoginInput, LoginOutput } from 'src/dto/login.dto';
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
    name,
    password,
    email,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      name = name.trim().replace('/', '-');
      password = password.trim();
      email = email.trim();

      const existsName = await this.user.findOne({ where: { name } });

      if (existsName) {
        return { ok: false, error: '이미 존재하는 닉네임입니다.' };
      }

      const existsEmail = await this.user.findOne({ where: { email } });

      if (existsEmail) {
        return { ok: false, error: '이미 존재하는 이메일입니다.' };
      }

      await this.user.save(
        this.user.create({
          name,
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
          error: '존재하지 않는 유저입니다.',
        };
      }

      // 비밀번호 일치하는지 확인
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: '비밀번호가 일치하지 않습니다.',
        };
      }

      const palyload = { id: user.id };
      const token = this.jwtService.sign(palyload);

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
