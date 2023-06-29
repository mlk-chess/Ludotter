import {Controller, Post, Inject, Body, Get, Param, Delete, Query, Patch} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('announcement')
export class AnnouncementController {
  constructor(@Inject('ANNOUNCEMENT_SERVICE') private client: ClientProxy) {}

  @Get('')
  getAnnouncements(@Query () params : any) {
    return this.client.send({ cmd: 'announcement_getAnnouncements' },{params});
  }

  @Get('/ordering')
  getOrdering(@Query () params : any) {
    return this.client.send({ cmd: 'announcement_getOrdering' },{params});
  }

  @Get('all')
  getAllAnnouncements(@Query () params : any) {
    return this.client.send({ cmd: 'announcement_getAllAnnouncements' },{params});
  }

  @Get('admin')
  getAnnouncementsAdmin() {
    return this.client.send({ cmd: 'announcement_getAnnouncementsAdmin' },{});
  }

  @Get(':id')
  getAnnouncementById(@Param('id') id: any) {
    return this.client.send({ cmd: 'announcement_getAnnouncementById' }, { id });
  }

  @Patch('/me/ordering/update')
  updateCheckout(@Body() checkout:any){
    return this.client.send({ cmd: 'announcement_updateCheckout' },checkout);
  }

  @Get('/me/ordering/:id')
  getCheckoutByProfileId(@Param('id') id: any) {
    return this.client.send({ cmd: 'announcement_getCheckoutByProfileId' }, { id });
  }

  @Get('/ordering/:id')
  getCheckoutById(@Param('id') id: any) {
    return this.client.send({ cmd: 'announcement_getCheckoutById' }, { id });
  }

  @Post('save')
  saveAnnouncement(@Body() announcement:any){
    return this.client.send({ cmd: 'announcement_saveAnnouncement' }, announcement);
  }

  @Patch(':id')
  updateAnnouncement(@Param('id') id: string, @Body() announcement:any){
    return this.client.send({ cmd: 'announcement_updateAnnouncement' }, {...announcement, id});
  }

  @Delete('delete')
  deleteAnnouncement(@Body() announcement:any){
    return this.client.send({ cmd: 'announcement_deleteAnnouncement' }, announcement);
  }

  @Delete('admin/delete')
  deleteAdminAnnouncement(@Body() announcement:any){
    return this.client.send({ cmd: 'announcement_deleteAdminAnnouncement' }, announcement);
  }

  @Patch('admin/cancel')
  cancelAnnouncement(@Body() announcement:any){
    return this.client.send({ cmd: 'announcement_cancelAnnouncement' },announcement);
  }

  @Patch('admin/publish')
  publishAnnouncement(@Body() announcement:any){
    return this.client.send({ cmd: 'announcement_publishAnnouncement' },announcement);
  }

  @Post('/checkout')
  checkout(@Body() announcement:any){
    return this.client.send({ cmd: 'announcement_checkout' }, announcement);
  }

  @Post('/checkout/location')
  checkoutLocation(@Body() announcement:any){
    return this.client.send({ cmd: 'announcement_checkoutLocation' }, announcement);
  }

  @Get('/checkout/date')
  checkoutDate(){
    return this.client.send({ cmd: 'announcement_checkoutDate' },  {});
  }
}