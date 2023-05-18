import { Controller, Post, Inject, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('announcement')
export class AnnouncementController {
  constructor(@Inject('ANNOUNCEMENT_SERVICE') private client: ClientProxy) {}

  @Post('save')
  saveCategory(@Body() announcement:any){
    return this.client.send({ cmd: 'announcement_saveAnnouncement' }, announcement);
  }
}