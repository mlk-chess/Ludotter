import { Controller, Post, Get, Inject, Param, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('message')
export class MessageController {

  constructor(@Inject('MESSAGE_SERVICE') private client: ClientProxy) {}


  @Get('')
  test() {
    return this.client.send({ cmd: 'message_test' },{});
  }

}