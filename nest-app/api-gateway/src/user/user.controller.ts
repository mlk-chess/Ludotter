import { Controller, Post, Get, Inject, Param, Body, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('user')
export class UserController {

  constructor(@Inject('USER_SERVICE') private client: ClientProxy) { }

  @Get('all')
  getParties() {
    return this.client.send({ cmd: 'users_getAll' }, {});
  }

}