import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-Parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD',
  });

  await app.listen(process.env.PORT ?? 3500);
}
bootstrap();
