import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import * as Joi from 'joi';
import { User } from './entity/user.entity';
import { ImageModule } from './image/image.module';
import { QnaModule } from './qna/qna.module';
import { Qna } from './entity/qna.entity';
import { ExamModule } from './exam/exam.module';
import { QuestionModule } from './question/question.module';
import { MultipleChoiceModule } from './multipleChoice/multipleChoice.module';
import { Exam } from './entity/exam.entity';
import { Question } from './entity/question.entity';
import { MultipleChoice } from './entity/multiple-choice.entity';
import { CrawlingModule } from './crawling/crawling.module';
import { Verification } from './entity/verification.entity';
import { VerificationModule } from './verification/verification.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    // Config 정의
    ConfigModule.forRoot({
      // 전역에서 사용가능하도록 정의
      isGlobal: true,
      //사용할 env 파일 이름
      envFilePath:
        process.env.NODE_ENV === 'dev'
          ? '.env.dev'
          : process.env.NODE_ENV === 'test'
          ? '.env.test'
          : '.env.prod',
      // 스키마 유효성 검사
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        SERVER_ADDRESS: Joi.string().required(),
        GMAIL_SMTP_NAME: Joi.string().required(),
        GMAIL_SMTP_KEY: Joi.string().required(),
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
      logging: false,
      // hot load 사용시 선언
      keepConnectionAlive: true,
      // 사용할 entity들 선언
      entities: [User, Qna, Exam, Question, MultipleChoice, Verification],
    }),
    // 메일 속성 정의
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: process.env.GMAIL_SMTP_NAME,
          pass: process.env.GMAIL_SMTP_KEY,
        },
      },
    }),
    AuthModule,
    UserModule,
    ImageModule,
    QnaModule,
    ExamModule,
    QuestionModule,
    MultipleChoiceModule,
    CrawlingModule,
    VerificationModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
