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

  @MessagePattern({ cmd: 'users_getById' })
  getUserById(id: string) {
    return this.appService.getUserById(id);
  }

  @MessagePattern({ cmd: 'users_create' })
  @UseFilters(new RpcValidationFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  createUser(newUser: any) {
    return this.appService.createUserAdmin(newUser);
  }

  @MessagePattern({ cmd: 'users_update' })
  @UseFilters(new RpcValidationFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  updateUser(user: any, id: string) {
    return this.appService.updateUser(user, id);
  }

  @MessagePattern({ cmd: 'users_delete' })
  deleteUser(id: string) {
    return this.appService.deleteUser(id);
  }

}