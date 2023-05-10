import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

@Module({

  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [{

    provide: 'AUTH_SERVICE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>

    ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 8080,

      },

    }),

  }],

})

export class AppModule {}