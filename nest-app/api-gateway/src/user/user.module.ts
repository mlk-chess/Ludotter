import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [{
    provide: 'USER_SERVICE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST,
          port: 4015,
        },
      }),
  }],
})

export class UserModule {}