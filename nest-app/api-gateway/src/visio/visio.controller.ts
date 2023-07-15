import { Controller, Post, Get, Inject, Param, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {AuthGuard} from "../shared/guards/auth.guard";
import {RolesGuard} from "../shared/guards/roles.guard";
import {Roles} from "../decorator/roles.decorator";

@Controller('visio')
export class VisioController {

  
  constructor(@Inject('VISIO_SERVICE') private client: ClientProxy) {}

  @Get('')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  getHello(@Req() request) {
    return this.client.send({ cmd: 'visio_hello' },{user: request.user});
  }

  @Get('getMyMeetings')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  getMyMeetings(@Req() request:any){
    return this.client.send({ cmd: 'visio_getMyMeetings' },{user: request.user});
  }

  @Get('getMyVisio')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  getMyVisio(@Req() request:any){
    return this.client.send({ cmd: 'visio_getMyVisio' },{user: request.user});
  }

  @Get('/all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  getAll(@Req() request) {
    return this.client.send({ cmd: 'visio_all' },{user: request.user});
  }
  @Post('/add')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  add(@Body() data:any, @Req() request) {
    return this.client.send({ cmd: 'visio_add' }, {...data, user: request.user});
  }

  @Delete('/delete')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  delete(@Body() data:any, @Req() request) {
    return this.client.send({ cmd: 'visio_delete' }, {...data, user: request.user});
  }

  @Post('/checkout')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT')
  checkout(@Body() data:any, @Req() request) {
    return this.client.send({ cmd: 'visio_checkout' }, {...data, user: request.user});
  }
}