import { Controller, Post, Get, Inject, Param, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AuthController {

  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  @Post('register')
  register(@Body() user:any) {
    return this.client.send({ cmd: 'register' }, user);
  }

}