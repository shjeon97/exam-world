import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/common/dto/output.dto';
import { DeleteMeInput } from 'src/user/dto/delete-me.dto';
import { EditMeInput } from 'src/user/dto/edit-me.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  async editMe(
    user: User,
    { email, nickname, password, editPassword }: EditMeInput,
  ): Promise<CoreOutput> {
    try {
      const existsPassword = await this.user.findOne({
        where: { id: user.id },
        select: ['id', 'password'],
      });

      const passwordCorrect = await existsPassword.checkPassword(password);

      if (!passwordCorrect) {
        return {
          ok: false,
          error: '비밀번호가 일치하지 않습니다.',
        };
      }

      nickname = nickname.trim().replace('/', '-');
      password = password.trim();
      email = email.trim();

      if (nickname !== user.nickname) {
        const existsName = await this.user.findOne({
          where: { nickname: nickname },
        });

        if (existsName) {
          return { ok: false, error: '이미 존재하는 닉네임입니다.' };
        }
      }

      if (email !== user.email) {
        const existsEmail = await this.user.findOne({ where: { email } });

        if (existsEmail) {
          return { ok: false, error: '이미 존재하는 이메일입니다.' };
        }
      }

      user.nickname = nickname;
      user.email = email;
      if (editPassword) {
        user.password = editPassword;
      }

      await this.user.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '유저 정보수정 실패',
      };
    }
  }

  async deleteMe(user: User, { password }: DeleteMeInput): Promise<CoreOutput> {
    try {
      const existsPassword = await this.user.findOne({
        where: { id: user.id },
        select: ['id', 'password'],
      });

      const passwordCorrect = await existsPassword.checkPassword(password);

      if (!passwordCorrect) {
        return {
          ok: false,
          error: '비밀번호가 일치하지 않습니다.',
        };
      }

      await this.user.delete({ id: user.id });

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '유저삭제 실패',
      };
    }
  }
}
