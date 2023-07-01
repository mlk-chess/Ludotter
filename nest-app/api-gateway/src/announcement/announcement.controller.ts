import {Controller, Post, Inject, Body, Get, Param, Delete, Query, Patch, UseGuards, Req} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {AuthGuard} from "../shared/guards/auth.guard";
import {RolesGuard} from "../shared/guards/roles.guard";
import {Roles} from "../decorator/roles.decorator";

@Controller('announcement')
export class AnnouncementController {
  constructor(@Inject('ANNOUNCEMENT_SERVICE') private client: ClientProxy) {}

  @Get('')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  getAnnouncements(@Query () params : any, @Req() request) {
    return this.client.send({ cmd: 'announcement_getAnnouncements' },{...params, user: request.user});
  }

  @Get('/ordering')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  getOrdering(@Query () params : any, @Req() request) {
    return this.client.send({ cmd: 'announcement_getOrdering' },{...params, user: request.user});
  }

  @Get('all')
  getAllAnnouncements(@Query () params : any) {
    return this.client.send({ cmd: 'announcement_getAllAnnouncements' },{params});
  }

  @Get('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAnnouncementsAdmin() {
    return this.client.send({ cmd: 'announcement_getAnnouncementsAdmin' },{});
  }

  @Get(':id')
  getAnnouncementById(@Param('id') id: any) {
    return this.client.send({ cmd: 'announcement_getAnnouncementById' }, { id });
  }

  @Patch('/me/ordering/update')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  updateCheckout(@Body() checkout:any, @Req() request){
    return this.client.send({ cmd: 'announcement_updateCheckout' }, {...checkout, user: request.user});
  }

  @Get('/me/ordering/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  getCheckoutByProfileId(@Param('id') id: any, @Req() request) {
    return this.client.send({ cmd: 'announcement_getCheckoutByProfileId' }, { ...id, user: request.user });
  }

  @Get('/ordering/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  getCheckoutById(@Param('id') id: any, @Req() request) {
    return this.client.send({ cmd: 'announcement_getCheckoutById' }, { ...id, user: request.user });
  }

  @Post('save')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  saveAnnouncement(@Body() announcement:any, @Req() request){
    return this.client.send({ cmd: 'announcement_saveAnnouncement' }, {...announcement, user: request.user});
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  updateAnnouncement(@Param('id') id: string, @Body() announcement:any, @Req() request){
    return this.client.send({ cmd: 'announcement_updateAnnouncement' }, {...announcement, id, user: request.user});
  }

  @Delete('delete')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  deleteAnnouncement(@Body() announcement:any, @Req() request){
    return this.client.send({ cmd: 'announcement_deleteAnnouncement' }, {...announcement, user: request.user});
  }

  @Delete('admin/delete')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteAdminAnnouncement(@Body() announcement:any){
    return this.client.send({ cmd: 'announcement_deleteAdminAnnouncement' }, announcement);
  }

  @Patch('admin/cancel')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  cancelAnnouncement(@Body() announcement:any){
    return this.client.send({ cmd: 'announcement_cancelAnnouncement' },announcement);
  }

  @Patch('admin/publish')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  publishAnnouncement(@Body() announcement:any){
    return this.client.send({ cmd: 'announcement_publishAnnouncement' },announcement);
  }

  @Post('/checkout')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  checkout(@Body() announcement:any, @Req() request){
    return this.client.send({ cmd: 'announcement_checkout' }, {...announcement, user: request.user});
  }

  @Post('/checkout/location')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  checkoutLocation(@Body() announcement:any, @Req() request){
    return this.client.send({ cmd: 'announcement_checkoutLocation' }, {...announcement, user: request.user});
  }

  @Get('/checkout/date')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  checkoutDate(){
    return this.client.send({ cmd: 'announcement_checkoutDate' },  {});
  }
}