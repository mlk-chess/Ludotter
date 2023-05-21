import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RpcValidationFilter } from './filters/rpc-exception.filter';
import { createAnnouncementDto } from './dto/create-announcement.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'announcement_getAnnouncements' })
  getAnnouncements() {
    return this.appService.getAnnouncements();
  }

  @MessagePattern({ cmd: 'announcement_saveAnnouncement' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  saveAnnouncement(createAnnouncement: createAnnouncementDto) {
    return this.appService.saveAnnouncement(createAnnouncement);
  }
}