import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

let testUser1 = {
  email: 'test1@test.com',
  nickname: 'test1',
  password: '1234',
};

let testUser2 = {
  email: 'test2@test.com',
  nickname: 'test2',
  password: '1234',
};

let deleteUser = {
  email: 'test3@test.com',
  nickname: 'test3',
  password: '1234',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let jwtToken1: string;
  let jwtToken2: string;
  let jwtToken3: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
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
  describe('AuthController (e2e)', () => {
    describe('registerUser', () => {
      const API_AUTH_SIGNUP = '/api/auth/register';
      it('계정이 생성되는지 확인', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_SIGNUP)
          .send({
            email: testUser1.email,
            nickname: testUser1.nickname,
            password: testUser1.password,
          })
          .expect(HttpStatus.CREATED)
          .expect({ ok: true });
      });

      it('계정이 생성되는지 확인 2', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_SIGNUP)
          .send({
            email: testUser2.email,
            nickname: testUser2.nickname,
            password: testUser2.password,
          })
          .expect(HttpStatus.CREATED)
          .expect({ ok: true });
      });

      it('계정이 생성되는지 확인 3', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_SIGNUP)
          .send({
            email: deleteUser.email,
            nickname: deleteUser.nickname,
            password: deleteUser.password,
          })
          .expect(HttpStatus.CREATED)
          .expect({ ok: true });
      });

      it('닉네임 중복시', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_SIGNUP)
          .send({
            email: testUser1.email + '!',
            nickname: testUser1.nickname,
            password: testUser1.password,
          })
          .expect(HttpStatus.CREATED)
          .expect({ ok: false, error: '이미 존재하는 닉네임입니다.' });
      });

      it('이메일 중복시', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_SIGNUP)
          .send({
            email: testUser1.email,
            nickname: testUser1.nickname + '!',
            password: testUser1.password,
          })
          .expect(HttpStatus.CREATED)
          .expect({ ok: false, error: '이미 존재하는 이메일입니다.' });
      });
    });

    describe('login', () => {
      const API_AUTH_LOGIN = '/api/auth/login';

      it('로그인 성공시 1', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_LOGIN)
          .send({
            email: testUser1.email,
            password: testUser1.password,
          })
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.ok).toBe(true);
            expect(res.body.token).toEqual(expect.any(String));
            jwtToken1 = res.body.token;
          });
      });

      it('로그인 성공시 2', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_LOGIN)
          .send({
            email: testUser2.email,
            password: testUser2.password,
          })
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.ok).toBe(true);
            expect(res.body.token).toEqual(expect.any(String));
            jwtToken2 = res.body.token;
          });
      });

      it('로그인 성공시 3', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_LOGIN)
          .send({
            email: deleteUser.email,
            password: deleteUser.password,
          })
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.ok).toBe(true);
            expect(res.body.token).toEqual(expect.any(String));
            jwtToken3 = res.body.token;
          });
      });

      it('이메일 미존재시', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_LOGIN)
          .send({
            email: testUser1.email + '!',
            password: testUser1.password,
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
            email: testUser1.email,
            password: testUser1.password + '!',
          })
          .expect(HttpStatus.OK)
          .expect({
            ok: false,
            error: '비밀번호가 일치하지 않습니다.',
          });
      });
    });
  });

  describe('UserController (e2e)', () => {
    const API_USER_ME = '/api/user/me';
    describe('getMe', () => {
      it('내 정보 가져오기', () => {
        return request(app.getHttpServer())
          .get(API_USER_ME)
          .set('authorization', `Bearer ${jwtToken1}`)
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.email).toBe(testUser1.email);
          });
      });

      it('JWT토큰 미존재시', () => {
        return request(app.getHttpServer())
          .get(API_USER_ME)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
      it('잘못된 JWT토큰일시', () => {
        return request(app.getHttpServer())
          .get(API_USER_ME)
          .set('authorization', `Bearer ${jwtToken1}!`)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });

    describe('editMe', () => {
      it('잘못된 비밀번호일시', () => {
        return request(app.getHttpServer())
          .patch(API_USER_ME)
          .send({
            email: '!' + testUser1.email,
            nickname: testUser1.nickname,
            password: testUser1.password + '!',
          })
          .set('authorization', `Bearer ${jwtToken1}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: false,
            error: '비밀번호가 일치하지 않습니다.',
          });
      });

      it('내 이메일정보 수정', () => {
        return request(app.getHttpServer())
          .patch(API_USER_ME)
          .send({
            email: '!' + testUser1.email,
            nickname: testUser1.nickname,
            password: testUser1.password,
          })
          .set('authorization', `Bearer ${jwtToken1}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: true,
          })
          .expect(() => {
            testUser1.email = '!' + testUser1.email;
          });
      });

      it('내 닉네임정보 수정', () => {
        return request(app.getHttpServer())
          .patch(API_USER_ME)
          .send({
            email: testUser1.email,
            nickname: '!' + testUser1.nickname,
            password: testUser1.password,
          })
          .set('authorization', `Bearer ${jwtToken1}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: true,
          })
          .expect(() => {
            testUser1.nickname = '!' + testUser1.nickname;
          });
      });

      it('내 비밀번호정보 수정', () => {
        return request(app.getHttpServer())
          .patch(API_USER_ME)
          .send({
            email: testUser1.email,
            nickname: testUser1.nickname,
            password: testUser1.password,
            editPassword: '!' + testUser1.password,
          })
          .set('authorization', `Bearer ${jwtToken1}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: true,
          })
          .expect(() => {
            testUser1.password = '!' + testUser1.password;
          });
      });

      it('변경할려는 이메일 이미 존재시', () => {
        return request(app.getHttpServer())
          .patch(API_USER_ME)
          .send({
            email: testUser2.email,
            nickname: testUser1.nickname,
            password: testUser1.password,
          })
          .set('authorization', `Bearer ${jwtToken1}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: false,
            error: '이미 존재하는 이메일입니다.',
          });
      });

      it('변경할려는 닉네임 이미 존재시', () => {
        return request(app.getHttpServer())
          .patch(API_USER_ME)
          .send({
            email: testUser1.email,
            nickname: testUser2.nickname,
            password: testUser1.password,
          })
          .set('authorization', `Bearer ${jwtToken1}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: false,
            error: '이미 존재하는 닉네임입니다.',
          });
      });
    });
    describe('deleteMe', () => {
      it('잘못된 비밀번호일시 ', () => {
        return request(app.getHttpServer())
          .delete(API_USER_ME)
          .send({
            password: testUser1.password + '!',
          })
          .set('authorization', `Bearer ${jwtToken1}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: false,
            error: '비밀번호가 일치하지 않습니다.',
          });
      });
      it('계정삭제', () => {
        return request(app.getHttpServer())
          .delete(API_USER_ME)
          .send({
            password: deleteUser.password,
          })
          .set('authorization', `Bearer ${jwtToken3}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: true,
          });
      });
    });
  });
  describe('QnaController (e2e)', () => {
    const APT_QNA_QUESTION = '/api/qna/question';
    describe('sendQuestion', () => {
      it('문의사항 질문 전송', () => {
        return request(app.getHttpServer())
          .post(APT_QNA_QUESTION)
          .send({
            email: testUser1.email,
            question: '<p>문의사항 TEST 입니다.</p>',
          })
          .expect(HttpStatus.CREATED)
          .expect({
            ok: true,
          });
      });
    });
  });

  describe('QnaController (e2e)', () => {
    const APT_QNA_QUESTION = '/api/qna/question';
    describe('sendQuestion', () => {
      it('문의사항 질문 전송', () => {
        return request(app.getHttpServer())
          .post(APT_QNA_QUESTION)
          .send({
            email: testUser1.email,
            question: '<p>문의사항 TEST 입니다.</p>',
          })
          .expect(HttpStatus.CREATED)
          .expect({
            ok: true,
          });
      });
    });
  });

  describe('ExamController (e2e)', () => {
    const APT_EXAM = '/api/exam';
    describe('createExam', () => {
      it('시험 생성', () => {
        return request(app.getHttpServer())
          .post(APT_EXAM)
          .send({
            name: 'TEST name',
            title: 'TEST title',
          })
          .set('authorization', `Bearer ${jwtToken1}`)
          .expect(HttpStatus.CREATED)
          .expect({
            ok: true,
            examId: 1,
          });
      });
    });
    describe('findExamListByMe', () => {
      it('자기가 만든 시험 정보 가져오기', () => {
        return request(app.getHttpServer())
          .get(APT_EXAM + '/me')
          .set('authorization', `Bearer ${jwtToken1}`)
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.ok).toBe(true);
            expect(res.body.examList).toEqual(expect.any(Array));
          });
      });
    });
  });
});
