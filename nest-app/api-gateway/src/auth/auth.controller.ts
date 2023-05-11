import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('hello')
export class AuthController {

  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  @Get(':name')
  getHelloByName(@Param('name') name = 'there') {

  // Forwards the name to your hello service, and returns the results
  return this.client.send({ cmd: 'hello' }, name);

  }

}