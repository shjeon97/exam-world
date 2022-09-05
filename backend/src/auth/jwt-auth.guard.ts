import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { AllowedRole } from './role.decorator';

export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(user, context: ExecutionContext) {
    // const role = this.reflector.get<AllowedRole>('role', context.getHandler());
    console.log(context);
    // if (!role) {
    //   return true;
    // }

    throw new UnauthorizedException();

    return user;
  }
}
