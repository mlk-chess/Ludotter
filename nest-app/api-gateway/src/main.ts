import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: "GET,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Accept, Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Credentials",
  });

  app.use(json({ limit: '100mb' }));

  await app.listen(3001);
}
bootstrap();
