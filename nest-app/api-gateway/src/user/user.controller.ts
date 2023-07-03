import { Controller, Post, Get, Inject, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Controller('user')
export class UserController {

  constructor(@Inject('USER_SERVICE') private client: ClientProxy) { }

  @Get('all')
  @UseGuards(AuthGuard)
  @Roles('ADMIN', 'CLIENT')
  getUsers() {
    console.log('getUsers');
    return this.client.send({ cmd: 'users_getAll' }, {});
  }

  @Get(':id')
  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN', 'CLIENT')
  getUserById(@Param('id') id: string) {
    return this.client.send({ cmd: 'users_getById' }, id);
  }

  @Post('admin/create')
  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN')
  createUser(@Body() newUser: any) {
    return this.client.send({ cmd: 'users_create' }, newUser);
  }

  @Patch('admin/update/:id')
  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN')
  updateUserAdmin(@Param('id') id: string, @Body() user:any) {
    return this.client.send({ cmd: 'users_update' },{...user,id});
  }

}