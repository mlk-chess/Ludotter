import {Controller, Post, Inject, Body, Get} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('announcement')
export class AnnouncementController {
  constructor(@Inject('ANNOUNCEMENT_SERVICE') private client: ClientProxy) {}

  @Get('')
  getAnnouncements() {
    return this.client.send({ cmd: 'announcement_getAnnouncements' },{});
  }

  @Post('save')
  saveAnnouncement(@Body() announcement:any){
    return this.client.send({ cmd: 'announcement_saveAnnouncement' }, announcement);
  }
}