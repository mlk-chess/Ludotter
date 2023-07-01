import { Controller, Post, Get, Inject, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller()
export class AuthController {

  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  @Post('register')
  register(@Body() user:any) {
    return this.client.send({ cmd: 'register' }, user);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() request:any){
    return this.client.send({ cmd: 'me' }, {user:request.user});
  }

}