import { Controller, Post, Get, Inject, Param, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('visio')
export class VisioController {

  
  constructor(@Inject('VISIO_SERVICE') private client: ClientProxy) {}

  @Get('')
  getHello() {
    return this.client.send({ cmd: 'visio_hello' },{});
  }

}