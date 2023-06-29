import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RpcValidationFilter } from './filters/rpc-exception.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern({ cmd: 'users_getAll' })
  getALlUsers() {
    return this.appService.getAllUsers();
  }
}