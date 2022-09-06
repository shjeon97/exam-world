import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { AllowedRole } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<AllowedRole>('role', context.getHandler());
    if (!role) {
      return true;
    }
    console.log(role);

    // Bearer 부분 제거한 토큰값 구하기
    const BearerTokenList = context
      .switchToHttp()
      .getRequest()
      ['headers'].authorization.split('Bearer ');

    const token = BearerTokenList[1];

    if (token) {
      // 토큰 복호화 설정
      const decoded = this.jwtService.verify(token.toString(), {
        secret: process.env.PRIVATE_KEY,
      });
      // 토큰 복호화하여 id 값 가져오기
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const user = await this.user.findOne({
          where: { id: decoded['id'] },
        });
        if (user) {
          if (role.includes('Any')) {
            return true;
          } else if (
            role.includes('SuperAdmin_Admin') &&
            user.role !== UserRole.User
          ) {
            return true;
          }

          return role.includes(user.role);
        }
      }
    }
    return false;
  }
}
