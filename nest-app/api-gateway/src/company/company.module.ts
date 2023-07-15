import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthModule } from 'src/auth/auth.module';
import { CompanyController } from './company.controller';

@Module({

  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [CompanyController],
  providers: [{

    provide: 'COMPANY_SERVICE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: process.env.COMPANY_SERVICE_HOST,
          port: 4009,

        },

      }),

  }],

})

export class CompanyModule {}