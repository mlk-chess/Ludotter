import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { AnnouncementModule } from "./announcement/announcement.module";
import { EventModule } from './event/event.module';

@Module({

  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CategoryModule,
    AnnouncementModule,
    EventModule
  ],
  controllers: [],
  providers: []

})

export class AppModule {}