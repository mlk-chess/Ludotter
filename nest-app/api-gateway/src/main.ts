import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS || "http://localhost:3002",
  });

  app.use(json({ limit: '10mb' }));

  await app.listen(3000);
}
bootstrap();
