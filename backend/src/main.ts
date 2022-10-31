import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });
  // 유효성검사 파이프 전역 설정
  app.useGlobalPipes(new ValidationPipe());

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  if (process.env.NODE_ENV === 'prod') {
    app.enableCors({
      origin: ['https://exam-world.prod.kro.kr'],
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: true,
      credentials: true,
    });
  }

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public',
  });

  // 전역 Route에 사용할 문자 정의
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('exam-world API')
    .setDescription('exam-world 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  try {
    await app.listen(process.env.PORT, () =>
      console.log(
        `Running on Port ${process.env.PORT} ${process.env.NODE_ENV}`,
      ),
    );
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
