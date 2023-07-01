import { Controller, Post, Get, Inject, Param, Body, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('user')
export class UserController {

  constructor(@Inject('USER_SERVICE') private client: ClientProxy) { }

  @Get('all')
  getUsers() {
    return this.client.send({ cmd: 'users_getAll' }, {});
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.client.send({ cmd: 'users_getById' }, id);
  }

  @Post('create')
  createUser(@Body() newUser: any) {
    return this.client.send({ cmd: 'users_create' }, newUser);
  }

  @Patch('update/:id')
  updateUser(@Body() user: any, @Param('id') id: string) {
    return this.client.send({ cmd: 'users_update' }, { user, id });
  }

  @Delete('delete/:id')
  deleteUser(@Param('id') id: string) {
    return this.client.send({ cmd: 'users_delete' }, id);
  }

}