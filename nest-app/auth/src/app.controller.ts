import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { createUserDto } from './dto/create-user.dto';
import { RpcValidationFilter } from './filters/rpc-exception.filter';

@Controller()
export class AppController {


  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'register' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  register(newUser : createUserDto) {
    return this.appService.register(newUser);
  }

  @MessagePattern({ cmd: 'verify' })
  @UseFilters(new RpcValidationFilter())
  verify(token:string) {
    return this.appService.getUserByToken(token);
  }

}