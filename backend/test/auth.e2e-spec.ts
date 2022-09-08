import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource, getConnection } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    // e2e 테스트가 끝나면 db를 drop해야 함
    const dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const connection = await dataSource.initialize();
    await connection.dropDatabase();
    await connection.destroy();
    await app.close();
  });

  describe('createUser', () => {
    const API_AUTH_SIGNUP = '/api/auth/signup';
    it('계정이 생성되는지 확인', () => {
      return request(app.getHttpServer())
        .post(API_AUTH_SIGNUP)
        .send({
          email: 'test@test.com',
          name: 'test',
          password: '12345678',
        })
        .expect(HttpStatus.CREATED)
        .expect({ ok: true });
    });

    it('닉네임 중복시', () => {
      return request(app.getHttpServer())
        .post(API_AUTH_SIGNUP)
        .send({
          email: 'test2@test.com',
          name: 'test',
          password: '12345678',
        })
        .expect(HttpStatus.CREATED)
        .expect({ ok: false, error: '이미 존재하는 닉네임입니다.' });
    });

    it('이메일 중복시', () => {
      return request(app.getHttpServer())
        .post(API_AUTH_SIGNUP)
        .send({
          email: 'test@test.com',
          name: 'test2',
          password: '12345678',
        })
        .expect(HttpStatus.CREATED)
        .expect({ ok: false, error: '이미 존재하는 이메일입니다.' });
    });
  });

  describe('login', () => {
    const API_AUTH_LOGIN = '/api/auth/login';

    it('로그인 성공시', () => {
      return request(app.getHttpServer())
        .post(API_AUTH_LOGIN)
        .send({
          email: 'test@test.com',
          password: '12345678',
        })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.ok).toBe(true);
          expect(res.body.token).toEqual(expect.any(String));
        });
    });

    it('이메일 미존재시', () => {
      return request(app.getHttpServer())
        .post(API_AUTH_LOGIN)
        .send({
          email: 'test2@test.com',
          password: '12345678',
        })
        .expect(HttpStatus.OK)
        .expect({
          ok: false,
          error: '존재하지 않는 유저입니다.',
        });
    });

    it('비밀번호 불일치시', () => {
      return request(app.getHttpServer())
        .post(API_AUTH_LOGIN)
        .send({
          email: 'test@test.com',
          password: '123456789',
        })
        .expect(HttpStatus.OK)
        .expect({
          ok: false,
          error: '비밀번호가 일치하지 않습니다.',
        });
    });
  });
});
