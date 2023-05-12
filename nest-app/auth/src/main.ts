import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from 'src/app.module';

async function bootstrap() {

  const port = 4000;

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_SERVICE_HOST,
      port,
    },
  });

  await app.listen();

}

bootstrap();
