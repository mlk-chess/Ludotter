import { Controller, Post, Get, Inject, Param, Body, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('event')
export class EventController {

  constructor(@Inject('EVENT_SERVICE') private client: ClientProxy) {}


  @Get('')
  getEvents() {
    return this.client.send({ cmd: 'event_getEvents' },{});
  }

}