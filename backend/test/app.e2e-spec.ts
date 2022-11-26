import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Verification } from 'src/entity/verification.entity';

let user1 = {
  email: 'user1@gamil.com',
  nickname: 'user1',
  password: '1234',
};

let user2 = {
  email: 'user2@gamil.com',
  nickname: 'user2',
  password: '1234',
};

let deleteUser = {
  email: 'deleteUser@gamil.com',
  nickname: 'deleteUser',
  password: '1234',
};

const update = 'update';

// 기본 게시물 페이지 번호
export const page = 1;
// 기본 게시물 개수
export const pageSize = 15;

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let verificationRepository: Repository<Verification>;
  let user1JwtToken: string;
  let user2JwtToken: string;
  let deleteUserJwtToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    verificationRepository = moduleFixture.get<Repository<Verification>>(
      getRepositoryToken(Verification),
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
    describe('signupUser', () => {
      const API_AUTH_SIGNUP = '/api/auth/signup';
      it('user1 생성', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_SIGNUP)
          .send({
            email: user1.email,
            nickname: user1.nickname,
            password: user1.password,
          })
          .expect(HttpStatus.CREATED)
          .expect({ ok: true });
      });

      it('user2 생성', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_SIGNUP)
          .send({
            email: user2.email,
            nickname: user2.nickname,
            password: user2.password,
          })
          .expect(HttpStatus.CREATED)
          .expect({ ok: true });
      });

      it('deleteUser 생성', () => {
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
            email: user1.email + update,
            nickname: user1.nickname,
            password: user1.password,
          })
          .expect(HttpStatus.CREATED)
          .expect({ ok: false, error: '이미 존재하는 닉네임입니다.' });
      });

      it('이메일 중복시', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_SIGNUP)
          .send({
            email: user1.email,
            nickname: user1.nickname + update,
            password: user1.password,
          })
          .expect(HttpStatus.CREATED)
          .expect({ ok: false, error: '이미 존재하는 이메일입니다.' });
      });
    });

    describe('login', () => {
      const API_AUTH_LOGIN = '/api/auth/login';

      it('user1 로그인 성공', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_LOGIN)
          .send({
            email: user1.email,
            password: user1.password,
          })
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.ok).toBe(true);
            expect(res.body.token).toEqual(expect.any(String));
            user1JwtToken = res.body.token;
          });
      });

      it('user2 로그인 성공', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_LOGIN)
          .send({
            email: user2.email,
            password: user2.password,
          })
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.ok).toBe(true);
            expect(res.body.token).toEqual(expect.any(String));
            user2JwtToken = res.body.token;
          });
      });

      it('deleteUser 로그인 성공', () => {
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
            deleteUserJwtToken = res.body.token;
          });
      });

      it('이메일 미존재시', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_LOGIN)
          .send({
            email: user1.email + update,
            password: user1.password,
          })
          .expect(HttpStatus.OK)
          .expect({
            ok: false,
            error:
              '등록되지 않은 이메일이거나, 이메일 또는 비밀번호를 잘못 입력하셨습니다.',
          });
      });

      it('비밀번호 불일치시', () => {
        return request(app.getHttpServer())
          .post(API_AUTH_LOGIN)
          .send({
            email: user1.email,
            password: user1.password + update,
          })
          .expect(HttpStatus.OK)
          .expect({
            ok: false,
            error:
              '등록되지 않은 이메일이거나, 이메일 또는 비밀번호를 잘못 입력하셨습니다.',
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
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.email).toBe(user1.email);
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
          .set('authorization', `Bearer ${user1JwtToken}!`)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });

    describe('editMe', () => {
      it('잘못된 비밀번호일시', () => {
        return request(app.getHttpServer())
          .put(API_USER_ME)
          .send({
            email: update + user1.email,
            nickname: user1.nickname,
            password: user1.password + update,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: false,
            error: '비밀번호가 일치하지 않습니다.',
          });
      });

      it('내 이메일정보 수정', () => {
        return request(app.getHttpServer())
          .put(API_USER_ME)
          .send({
            email: update + user1.email,
            nickname: user1.nickname,
            password: user1.password,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: true,
          })
          .expect(() => {
            user1.email = update + user1.email;
          });
      });

      it('내 닉네임정보 수정', () => {
        return request(app.getHttpServer())
          .put(API_USER_ME)
          .send({
            email: user1.email,
            nickname: update + user1.nickname,
            password: user1.password,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: true,
          })
          .expect(() => {
            user1.nickname = update + user1.nickname;
          });
      });

      it('내 비밀번호 정보 수정', () => {
        return request(app.getHttpServer())
          .put(API_USER_ME)
          .send({
            email: user1.email,
            nickname: user1.nickname,
            password: user1.password,
            editPassword: update + user1.password,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: true,
          })
          .expect(() => {
            user1.password = update + user1.password;
          });
      });

      it('변경할려는 이메일 이미 존재시', () => {
        return request(app.getHttpServer())
          .put(API_USER_ME)
          .send({
            email: user2.email,
            nickname: user1.nickname,
            password: user1.password,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: false,
            error: '이미 존재하는 이메일입니다.',
          });
      });

      it('변경할려는 닉네임 이미 존재시', () => {
        return request(app.getHttpServer())
          .put(API_USER_ME)
          .send({
            email: user1.email,
            nickname: user2.nickname,
            password: user1.password,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
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
            password: user1.password + update,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
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
          .set('authorization', `Bearer ${deleteUserJwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: true,
          });
      });
    });
  });

  describe('VerificationController', () => {
    const API_VERIFICATION = '/api/verification';
    describe('verifyEmail', () => {
      it('user1 이메일 인증', async () => {
        const user1Verification = await verificationRepository.findOne({
          where: { user: { nickname: user1.nickname } },
        });

        return request(app.getHttpServer())
          .put(API_VERIFICATION + '/email')
          .send({ code: user1Verification.code })
          .expect(HttpStatus.OK)
          .expect({
            ok: true,
          });
      });
    });
    describe('verifyEmail', () => {
      it('user2 이메일 인증', async () => {
        const user2Verification = await verificationRepository.findOne({
          where: { user: { nickname: user2.nickname } },
        });

        return request(app.getHttpServer())
          .put(API_VERIFICATION + '/email')
          .send({ code: user2Verification.code })
          .expect(HttpStatus.OK)
          .expect({
            ok: true,
          });
      });
    });
  });

  describe('QnaController (e2e)', () => {
    const API_QNA_QUESTION = '/api/qna/question';
    describe('sendQuestion', () => {
      it('문의사항 질문 전송', () => {
        return request(app.getHttpServer())
          .post(API_QNA_QUESTION)
          .send({
            email: user1.email,
            title: '문의사항',
            question: '<p>문의사항 TEST 입니다.</p>',
          })
          .expect(HttpStatus.CREATED)
          .expect({
            ok: true,
          });
      });
    });
  });

  describe('ExamController 문제, 보기 생성전 (e2e)', () => {
    const API_EXAM = '/api/exam';
    describe('createExam', () => {
      it('시험 생성 user1', () => {
        return request(app.getHttpServer())
          .post(API_EXAM)
          .send({
            title: 'TEST1 title',
            description: 'TEST1 description',
            time: 60,
            minimumPassScore: 60,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.CREATED)
          .expect({
            ok: true,
            examId: 1,
          });
      });

      it('시험 생성 user2', () => {
        return request(app.getHttpServer())
          .post(API_EXAM)
          .send({
            title: 'TEST2 title',
            description: 'TEST2 description',
            time: 60,
            minimumPassScore: 60,
          })
          .set('authorization', `Bearer ${user2JwtToken}`)
          .expect(HttpStatus.CREATED)
          .expect({
            ok: true,
            examId: 2,
          });
      });
    });
  });

  describe('QuestionController (e2e)', () => {
    const API_QUESTION = '/api/question';
    describe('saveQuestion', () => {
      it('문제 생성', () => {
        return request(app.getHttpServer())
          .post(API_QUESTION)
          .send({
            examId: 2,
            text: 'test',
            page: 1,
            score: 1,
          })
          .set('authorization', `Bearer ${user2JwtToken}`)
          .expect(HttpStatus.CREATED)
          .expect({
            ok: true,
          });
      });
      it('문제 변경', () => {
        return request(app.getHttpServer())
          .post(API_QUESTION)
          .send({
            examId: 2,
            text: 'test2',
            page: 1,
            score: 1,
          })
          .set('authorization', `Bearer ${user2JwtToken}`)
          .expect(HttpStatus.CREATED)
          .expect({
            ok: true,
          });
      });
      it('examId와 일치하는 시험 미존재시', () => {
        return request(app.getHttpServer())
          .post(API_QUESTION)
          .send({
            examId: 999,
            text: 'test',
            page: 1,
            score: 1,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.CREATED)
          .expect({
            ok: false,
            error: '존재하지 않는 시험 입니다.',
          });
      });
    });
  });

  describe('MultipleChoiceController (e2e)', () => {
    const API_MULTIPLE_CHOICE = '/api/multiple-choice';
    describe('saveMultipleChoice', () => {
      it('보기 생성 (delete 예정)', () => {
        return request(app.getHttpServer())
          .post(API_MULTIPLE_CHOICE)
          .send({
            examId: 1,
            text: 'test',
            page: 1,
            isCorrectAnswer: true,
            no: 1,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.CREATED)
          .expect({
            ok: true,
          });
      });
      it('보기 변경', () => {
        return request(app.getHttpServer())
          .post(API_MULTIPLE_CHOICE)
          .send({
            examId: 1,
            text: 'test',
            page: 1,
            isCorrectAnswer: true,
            no: 2,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.CREATED)
          .expect({
            ok: true,
          });
      });
      it('examId와 일치하는 시험 미존재시', () => {
        return request(app.getHttpServer())
          .post(API_MULTIPLE_CHOICE)
          .send({
            examId: 999,
            text: 'test',
            page: 1,
            isCorrectAnswer: true,
            no: 1,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.CREATED)
          .expect({
            ok: false,
            error: '존재하지 않는 시험 입니다.',
          });
      });

      it('보기 생성', () => {
        return request(app.getHttpServer())
          .post(API_MULTIPLE_CHOICE)
          .send({
            examId: 2,
            text: 'test',
            page: 1,
            isCorrectAnswer: true,
            no: 1,
          })
          .set('authorization', `Bearer ${user2JwtToken}`)
          .expect(HttpStatus.CREATED)
          .expect({
            ok: true,
          });
      });
      it('보기 생성2', () => {
        return request(app.getHttpServer())
          .post(API_MULTIPLE_CHOICE)
          .send({
            examId: 2,
            text: 'test',
            page: 1,
            isCorrectAnswer: true,
            no: 2,
          })
          .set('authorization', `Bearer ${user2JwtToken}`)
          .expect(HttpStatus.CREATED)
          .expect({
            ok: true,
          });
      });
    });
    describe('deleteMultipleChoicesByExamIdAndPage', () => {
      it('examId, page 정보와 일치하는 보기 모두 삭제', () => {
        return request(app.getHttpServer())
          .delete(API_MULTIPLE_CHOICE + 's')
          .send({
            examId: 1,
            page: 1,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: true,
          });
      });
      it('examId와 일치하는 시험 미존재시', () => {
        return request(app.getHttpServer())
          .delete(API_MULTIPLE_CHOICE + 's')
          .send({
            examId: 999,
            page: 1,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: false,
            error: '존재하지 않는 시험 입니다.',
          });
      });
    });
  });

  describe('ExamController 문제, 보기 생성후 (e2e)', () => {
    const API_EXAM = '/api/exam';

    describe('searchExams', () => {
      it('시험 목록', () => {
        return request(app.getHttpServer())
          .get(API_EXAM + `/search?page-size=${pageSize}&page=${page}`)
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.ok).toBe(true);
            expect(res.body.result).toEqual(expect.any(Array));
          });
      });
    });

    describe('ExamsByMe', () => {
      it('자기가 만든 시험 목록', () => {
        return request(app.getHttpServer())
          .get(API_EXAM + `/me/search?page-size=${pageSize}&page=${page}`)
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.ok).toBe(true);
            expect(res.body.result).toEqual(expect.any(Array));
          });
      });
    });
    describe('findQuestionsByExamId', () => {
      it('examId 갖고있는 모든 question 가져오기', () => {
        return request(app.getHttpServer())
          .get(API_EXAM + '/1/questions')
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.ok).toBe(true);
            expect(res.body.questions).toEqual(expect.any(Array));
          });
      });
    });
    describe('findMultipleChoicesByExamId', () => {
      it('examId 갖고있는 모든 multiple-choice 가져오기', () => {
        return request(app.getHttpServer())
          .get(API_EXAM + '/1/multiple-choices')
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.ok).toBe(true);
            expect(res.body.multipleChoices).toEqual(expect.any(Array));
          });
      });
    });
    describe('findExamById', () => {
      it('id로 시험 정보 가져오기', () => {
        return request(app.getHttpServer())
          .get(API_EXAM + '/1')
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.ok).toBe(true);
            expect(res.body.exam).toEqual(expect.any(Object));
          });
      });
    });
    describe('editExam', () => {
      it('시험 정보 수정', () => {
        return request(app.getHttpServer())
          .put(API_EXAM)
          .send({
            id: 1,
            name: 'test' + update,
            description: 'test' + update,
            time: 0,
            minimumPassScore: 0,
          })
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: true,
          });
      });
    });
    describe('deleteExamLastPage', () => {
      it('존재하지 않는 시험 Id일 경우', () => {
        return request(app.getHttpServer())
          .delete(API_EXAM + '/999/last-page')
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: false,
            error: '존재하지 않는 시험 정보 입니다.',
          });
      });
      it('해당 시험을 생성한 User가 아닐 경우', () => {
        return request(app.getHttpServer())
          .delete(API_EXAM + '/1/last-page')
          .set('authorization', `Bearer ${user2JwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: false,
            error: '다른 사용자가 만든 문항을 삭제하실 수 없습니다.',
          });
      });
      it('시험 마지막 페이지 (문제,보기) 삭제하기', () => {
        return request(app.getHttpServer())
          .delete(API_EXAM + '/2/last-page')
          .set('authorization', `Bearer ${user2JwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: true,
          });
      });
    });

    describe('deleteExamById', () => {
      it('존재하지 않는 시험 Id일 경우', () => {
        return request(app.getHttpServer())
          .delete(API_EXAM + '/999')
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: false,
            error: '존재하지 않는 시험 정보 입니다.',
          });
      });
      it('해당 시험을 생성한 User가 아닐 경우', () => {
        return request(app.getHttpServer())
          .delete(API_EXAM + '/1')
          .set('authorization', `Bearer ${user2JwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: false,
            error: '다른 사용자가 만든 시험을 삭제하실 수 없습니다.',
          });
      });
      it('시험 정보 삭제하기', () => {
        return request(app.getHttpServer())
          .delete(API_EXAM + '/1')
          .set('authorization', `Bearer ${user1JwtToken}`)
          .expect(HttpStatus.OK)
          .expect({
            ok: true,
          });
      });
    });
  });
});
