import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { EventController } from './event.controller';

@Module({

  imports: [ConfigModule.forRoot()],
  controllers: [EventController],
  providers: [{

    provide: 'EVENT_SERVICE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: process.env.EVENT_SERVICE_HOST,
          port: 4007,

        },

      }),

  }],

})

export class EventModule {}