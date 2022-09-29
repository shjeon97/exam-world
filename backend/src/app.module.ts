import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    // Config 정의
    ConfigModule.forRoot({
      // 전역에서 사용가능하도록 정의
      isGlobal: true,
      //사용할 env 파일 이름
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
      // 스키마 유효성 검사
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        SERVER_ADDRESS: Joi.string().required(),
      }),
    }),
    // typeORM 정의
    TypeOrmModule.forRoot({
      // DB 종류
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      // 계정 정보
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      // DB 이름
      database: process.env.DB_NAME,
      // 마이그레이션
      synchronize: process.env.NODE_ENV !== 'prod',
      // DB로그
      logging: process.env.NODE_ENV !== 'prod',
      // hot load 사용시 선언
      keepConnectionAlive: true,
      // 사용할 entity들 선언
      entities: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
