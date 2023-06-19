import { Controller, Post, Get, Inject, Param, Body, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('event')
export class EventController {

  constructor(@Inject('EVENT_SERVICE') private client: ClientProxy) {}


  @Get('')
  getEvents() {
    return this.client.send({ cmd: 'event_getEvents' },{});
  }

  @Get(':id')
  getEventById(@Param('id') id: any) {
    return this.client.send({ cmd: 'event_getEventById' }, id );
  }

  @Get('me')
  getMyEvents() {
    return this.client.send({ cmd: 'event_getMyEvents' },{});
  }

  @Post('')
  saveEvent(@Body() event:any){
    return this.client.send({ cmd: 'event_saveEvent' },event);
  }

  @Patch(':id')
  updateEvent(@Param('id') id: string, @Body() event:any){
    return this.client.send({ cmd: 'event_updateEvent' },{...event,id});
  }

}