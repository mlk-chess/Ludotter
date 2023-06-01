import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { AnnouncementModule } from "./announcement/announcement.module";
import { PartyModule } from './party/party.module';

@Module({

  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CategoryModule,
    AnnouncementModule,
    PartyModule
  ],
  controllers: [],
  providers: []

})

export class AppModule {}