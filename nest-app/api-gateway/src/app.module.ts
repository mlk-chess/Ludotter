import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({

  imports: [
    ConfigModule.forRoot(),
    AuthModule
  ],
  controllers: [],
  providers: []

})

export class AppModule {}