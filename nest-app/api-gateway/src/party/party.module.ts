import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PartyController } from './party.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(),AuthModule],
  controllers: [PartyController],
  providers: [{

    provide: 'PARTY_SERVICE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: process.env.PARTY_SERVICE_HOST,
          port: 4005,
        },
      }),
  }],
})

export class PartyModule {}