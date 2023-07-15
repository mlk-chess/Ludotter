import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AnnouncementController } from './announcement.controller';
import {AuthModule} from "../auth/auth.module";

@Module({

  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [AnnouncementController],
  providers: [{
    provide: 'ANNOUNCEMENT_SERVICE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: process.env.ANNOUNCEMENT_SERVICE_HOST,
          port: 4002,
        },
      }),
  }],
})

export class AnnouncementModule {}