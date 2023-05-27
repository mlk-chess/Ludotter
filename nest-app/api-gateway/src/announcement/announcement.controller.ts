import {Controller, Post, Inject, Body, Get, Param, Delete} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('announcement')
export class AnnouncementController {
  constructor(@Inject('ANNOUNCEMENT_SERVICE') private client: ClientProxy) {}

  @Get('')
  getAnnouncements() {
    return this.client.send({ cmd: 'announcement_getAnnouncements' },{});
  }

  @Get(':id')
  getAnnouncementById(@Param('id') id: any) {
    return this.client.send({ cmd: 'announcement_getAnnouncementById' }, { id });
  }

  @Post('save')
  saveAnnouncement(@Body() announcement:any){
    return this.client.send({ cmd: 'announcement_saveAnnouncement' }, announcement);
  }

  @Delete('delete')
  deleteAnnouncement(@Body() announcement:any){
    return this.client.send({ cmd: 'announcement_deleteAnnouncement' }, announcement);
  }
}