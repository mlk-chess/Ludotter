import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';

@Module({

  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CategoryModule
  ],
  controllers: [],
  providers: []

})

export class AppModule {}