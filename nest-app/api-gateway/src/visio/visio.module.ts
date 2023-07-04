import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { VisioController } from './visio.controller';

@Module({

  imports: [ConfigModule.forRoot(),AuthModule],
  controllers: [VisioController],
  providers: [{

    provide: 'VISIO_SERVICE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: process.env.VISIO_SERVICE_HOST,
          port: 4015,

        },

      }),

  }],

})

export class VisioModule {}