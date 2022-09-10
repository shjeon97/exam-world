import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './role.guard';

// @Global()
// @Module({})
// export class AuthModule {
//   static register(privateKey: string): DynamicModule {
//     return {
//       module: AuthModule,
//       imports: [
//         PassportModule.register({ defaultStrategy: 'jwt' }),
//         JwtModule.registerAsync({
//           inject: [ConfigService],
//           useFactory: (config: ConfigService) => ({
//             secret: config.get<string>('PRIVATE_KEY'),
//             signOptions: { expiresIn: '1d' },
//           }),
//         }),
//         TypeOrmModule.forFeature([User]),
//       ],
//       providers: [
//         AuthService,
//         JwtStrategy,
//         {
//           provide: APP_GUARD,
//           useClass: RoleGuard,
//         },
//       ],
//       controllers: [AuthController],
//       exports: [JwtStrategy, PassportModule],
//     };
//   }
// }

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('PRIVATE_KEY'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
