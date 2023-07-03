import { Controller, Post, Get, Inject, Param, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Controller('event')
export class EventController {

  constructor(@Inject('EVENT_SERVICE') private client: ClientProxy) {}



  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN')
  @Get('getCompanies')
  getCompanies(){
    return this.client.send({ cmd: 'event_getCompanies' }, {});
  }


  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN')
  @Post('saveEventAdmin')
  saveEventAdmin(@Body() event:any){
    return this.client.send({ cmd: 'event_saveEventAdmin' }, event);
  }
  

  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN')
  @Get('getEventsAdmin')
  getEventsAdmin() {
    return this.client.send({ cmd: 'event_getEventsAdmin' },{});
  }

  @Get('coming')
  getEventsComing() {
    return this.client.send({ cmd: 'event_getEventsComing' },{});
  }



  @UseGuards(AuthGuard,RolesGuard)
  @Roles('COMPANY')
  @Get('me')
  getMyEvents(@Req() request:any) {
    return this.client.send({ cmd: 'event_getMyEvents' },{user:request.user});
  }


  @Get(':id')
  getEventById(@Param('id') id: any) {
    return this.client.send({ cmd: 'event_getEventById' }, id );
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles('COMPANY')
  @Post('')
  saveEvent(@Body() event:any, @Req() request:any){
    return this.client.send({ cmd: 'event_saveEvent' },{...event, user:request.user});
  }


  @UseGuards(AuthGuard,RolesGuard)
  @Roles('COMPANY','ADMIN')
  @Patch(':id')
  updateEvent(@Param('id') id: string, @Body() event:any, @Req() request:any){
    return this.client.send({ cmd: 'event_updateEvent' },{...event,id, user:request.user});
  }


  @UseGuards(AuthGuard,RolesGuard)
  @Roles('CLIENT')
  @Delete('leave')
  leaveEvent(@Body() leaveEvent:any, @Req() request:any){
    return this.client.send({ cmd: 'event_leaveEvent' }, {...leaveEvent, user:request.user});
  }
  

  @UseGuards(AuthGuard,RolesGuard)
  @Roles('COMPANY','ADMIN')
  @Delete(':id')
  deleteEvent(@Param('id') id: string){
    return this.client.send({ cmd: 'event_deleteEvent' },id);
  }


  @UseGuards(AuthGuard,RolesGuard)
  @Roles('CLIENT')
  @Post('join')
  joinEvent(@Body() joinEvent:any, @Req() request:any){
    return this.client.send({ cmd: 'event_joinEvent' }, {...joinEvent, user:request.user});
  }


  @UseGuards(AuthGuard,RolesGuard)
  @Roles('COMPANY','ADMIN')
  @Get('getUsersByEvent/:id')
  getUsersByEvent(@Param('id') id:string){
    return this.client.send({ cmd: 'event_getUsersByEvent' }, id);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles('CLIENT')
  @Get('getUserByEvent/:id')
  getUserByEvent(@Param('id') id:string, @Req() request:any){
    return this.client.send({ cmd: 'event_getUserByEvent' }, {id, user:request.user});
  }

}