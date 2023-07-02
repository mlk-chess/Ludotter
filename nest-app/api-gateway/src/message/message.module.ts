import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { MessageController } from './message.controller';

@Module({

  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [MessageController],
  providers: [{

    provide: 'MESSAGE_SERVICE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: process.env.MESSAGE_SERVICE_HOST,
          port: 4010,

        },

      }),

  }],

})

export class MessageModule {}