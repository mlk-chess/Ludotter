import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { AnnouncementModule } from "./announcement/announcement.module";
import { EventModule } from './event/event.module';
import { PartyModule } from './party/party.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { StatusInterceptor } from './interceptor/status.interceptor';
import { RolesGuard } from './shared/guards/roles.guard';
import { AuthGuard } from './shared/guards/auth.guard';
import { MessageModule } from './message/message.module';
import { CompanyModule } from './company/company.module';

@Module({

  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CategoryModule,
    AnnouncementModule,
    EventModule,
    PartyModule,
    MessageModule,
    PartyModule,
    CompanyModule
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