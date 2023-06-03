import {Controller, UseFilters, UsePipes, ValidationPipe} from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RpcValidationFilter } from './filters/rpc-exception.filter';
import { createAnnouncementDto } from './dto/create-announcement.dto';
import { deleteAnnouncementDto } from './dto/delete-announcement.dto';
import { fetchAnnouncementsDto } from './dto/fetch-announcement.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'announcement_getAnnouncements' })
  getAnnouncements(fetchAnnouncement: fetchAnnouncementsDto) {
    return this.appService.getAnnouncements(fetchAnnouncement);
  }

  @MessagePattern({ cmd: 'announcement_getAnnouncementById' })
  getAnnouncementById(id: any) {
    return this.appService.getAnnouncementById(id.id);
  }

  @MessagePattern({ cmd: 'announcement_saveAnnouncement' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  saveAnnouncement(createAnnouncement: createAnnouncementDto) {
    return this.appService.saveAnnouncement(createAnnouncement);
  }

  @MessagePattern({ cmd: 'announcement_deleteAnnouncement' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  deleteAnnouncement(deleteAnnouncement: deleteAnnouncementDto) {
    return this.appService.deleteAnnouncement(deleteAnnouncement);
  }

  @MessagePattern({ cmd: 'announcement_getAnnouncementsAdmin' })
  getAnnouncementsAdmin() {
    return this.appService.getAnnouncementsAdmin();
  }

  @MessagePattern({ cmd: 'announcement_cancelAnnouncement' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  cancelAnnouncement(cancelAnnouncement: deleteAnnouncementDto) {
    return this.appService.cancelAnnouncement(cancelAnnouncement);
  }
}