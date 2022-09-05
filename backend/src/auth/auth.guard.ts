import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { AllowedRole } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User)
    private readonly user: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const role = this.reflector.get<AllowedRole>('role', context.getHandler());
    if (!role) {
      return true;
    }
    const httpHeader = context.switchToHttp().getRequest()['headers'];

    console.log(httpHeader.authorization);

    const token = httpHeader.authorization;

    if (token) {
      const decoded = this.jwtService.verify(token.toString(), {
        secret: process.env.PRIVATE_KEY,
      });
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const user = await this.user.findOne({
          where: { id: decoded['id'] },
        });
        if (user) {
          httpHeader['user'] = user;

          if (role.includes('Any')) {
            return true;
          } else if (
            role.includes('SuperAdmin_Admin') &&
            user.role !== UserRole.User
          ) {
            return true;
          }

          // return role.includes(user.role);
        }
      }
    }
    return false;
  }
}
