import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { AnnouncementModule } from "./announcement/announcement.module";
import { PartyModule } from './party/party.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { StatusInterceptor } from './interceptor/status.interceptor';

@Module({

  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CategoryModule,
    AnnouncementModule,
    PartyModule
  ],
  controllers: [],
  providers: [
    { 
      provide : APP_INTERCEPTOR,
      useClass: StatusInterceptor
    }        
  ]

})

export class AppModule {}