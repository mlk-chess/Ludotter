import {Controller, UseFilters, UsePipes, ValidationPipe} from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RpcValidationFilter } from './filters/rpc-exception.filter';
import { createAnnouncementDto } from './dto/create-announcement.dto';
import { updateAnnouncementDto } from './dto/update-announcement.dto';
import { deleteAnnouncementDto } from './dto/delete-announcement.dto';
import { checkoutAnnouncementDto } from './dto/checkout-announcement.dto';
import { checkoutLocationAnnouncementDto } from './dto/checkout-location-announcement.dto';
import { fetchAnnouncementsDto } from './dto/fetch-announcement.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'announcement_getAnnouncements' })
  @UseFilters(new RpcValidationFilter())
  getAnnouncements(fetchAnnouncement: fetchAnnouncementsDto) {
    return this.appService.getAnnouncements(fetchAnnouncement);
  }

  @MessagePattern({ cmd: 'announcement_getAllAnnouncements' })
  @UseFilters(new RpcValidationFilter())
  getAllAnnouncements(fetchAnnouncement: fetchAnnouncementsDto) {
    return this.appService.getAllAnnouncements(fetchAnnouncement);
  }

  @MessagePattern({ cmd: 'announcement_getAnnouncementById' })
  @UseFilters(new RpcValidationFilter())
  getAnnouncementById(id: any) {
    return this.appService.getAnnouncementById(id.id);
  }

  @MessagePattern({ cmd: 'announcement_getCheckoutById' })
  @UseFilters(new RpcValidationFilter())
  getCheckoutById(id: any) {
    return this.appService.getCheckoutById(id.id);
  }

  @MessagePattern({ cmd: 'announcement_saveAnnouncement' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  saveAnnouncement(createAnnouncement: createAnnouncementDto) {
    return this.appService.saveAnnouncement(createAnnouncement);
  }

  @MessagePattern({ cmd: 'announcement_updateAnnouncement' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  updateAnnouncement(updateAnnouncement: updateAnnouncementDto) {
    return this.appService.updateAnnouncement(updateAnnouncement);
  }

  @MessagePattern({ cmd: 'announcement_deleteAnnouncement' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  deleteAnnouncement(deleteAnnouncement: deleteAnnouncementDto) {
    return this.appService.deleteAnnouncement(deleteAnnouncement);
  }

  @MessagePattern({ cmd: 'announcement_deleteAdminAnnouncement' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  deleteAdminAnnouncement(deleteAdminAnnouncement: deleteAnnouncementDto) {
    return this.appService.deleteAdminAnnouncement(deleteAdminAnnouncement);
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

  @MessagePattern({ cmd: 'announcement_publishAnnouncement' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  publishAnnouncement(publishAnnouncement: deleteAnnouncementDto) {
    return this.appService.publishAnnouncement(publishAnnouncement);
  }

  @MessagePattern({ cmd: 'announcement_checkout' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  checkout(checkout: checkoutAnnouncementDto) {
    return this.appService.checkout(checkout);
  }

  @MessagePattern({ cmd: 'announcement_checkoutLocation' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  checkoutLocation(checkoutLocation: checkoutLocationAnnouncementDto) {
    return this.appService.checkoutLocation(checkoutLocation);
  }

  @MessagePattern({ cmd: 'announcement_checkoutDate' })
  checkoutDate() {
    return this.appService.checkoutDate();
  }

  @MessagePattern({ cmd: 'announcement_getOrdering' })
  @UseFilters(new RpcValidationFilter())
  getOrdering(fetchAnnouncement: fetchAnnouncementsDto) {
    return this.appService.getOrdering(fetchAnnouncement);
  }
}