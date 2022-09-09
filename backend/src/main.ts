import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 유효성검사 파이프 전역 설정
  app.useGlobalPipes(new ValidationPipe());

  if (process.env.NODE_ENV === 'prod') {
    app.enableCors({
      origin: ['https://exam-world.shjeon.kro.kr'],
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: true,
      credentials: true,
    });
  }

  // 전역 Route에 사용할 문자 정의
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('exam-world API')
    .setDescription('exam-world 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    // .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  try {
    await app.listen(process.env.PORT, () =>
      console.log(`Running on Port ${process.env.PORT}`),
    );
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
