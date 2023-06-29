import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { AnnouncementModule } from "./announcement/announcement.module";
import { PartyModule } from './party/party.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { StatusInterceptor } from './interceptor/status.interceptor';
import { RolesGuard } from './shared/guards/roles.guard';
import { AuthGuard } from './shared/guards/auth.guard';

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
    },
    { 
      provide : APP_GUARD,
      useClass: AuthGuard
    },    
    { 
      provide : APP_GUARD,
      useClass: RolesGuard
    }      
  ]

})

export class AppModule {}