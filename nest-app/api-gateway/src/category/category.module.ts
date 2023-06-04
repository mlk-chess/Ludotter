import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CategoryController } from './category.controller';

@Module({

  imports: [ConfigModule.forRoot()],
  controllers: [CategoryController],
  providers: [{

    provide: 'CATEGORY_SERVICE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: process.env.CATEGORY_SERVICE_HOST,
          port: 4001,

        },

      }),

  }],

})

export class CategoryModule {}