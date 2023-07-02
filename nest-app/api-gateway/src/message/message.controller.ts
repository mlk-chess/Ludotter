import { Controller, Post, Get, Inject, Param, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Controller('message')
export class MessageController {

  constructor(@Inject('MESSAGE_SERVICE') private client: ClientProxy) {}


  @UseGuards(AuthGuard,RolesGuard)
  @Roles('CLIENT')
  @Get('getPartiesConversation')
  getPartiesConversation(@Req() request:any){
    return this.client.send({ cmd: 'message_getPartiesConversation' },{user:request.user});
  }


  @UseGuards(AuthGuard,RolesGuard)
  @Roles('CLIENT')
  @Get('getAnnouncementsConversation')
  getAnnouncementsConversation(@Req() request:any){
    return this.client.send({ cmd: 'message_getAnnouncementsConversation' },{user:request.user});
  }


  @UseGuards(AuthGuard,RolesGuard)
  @Roles('CLIENT')
  @Get('getMessagesByConversation/:id')
  getMessagesByConversation(@Param('id') id: any, @Req() request:any){
    return this.client.send({ cmd: 'message_getMessagesByConversation' },{id, user:request.user });
  }



  @UseGuards(AuthGuard,RolesGuard)
  @Roles('CLIENT')
  @Post('sendMessageParty')
  sendMessageParty(@Body() conversation:any, @Req() request:any){
    return this.client.send({ cmd: 'message_sendMessageParty' },{...conversation, user:request.user});
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles('CLIENT')
  @Get('getLastConversation')
  getLastConversation(@Req() request:any){
    return this.client.send({ cmd: 'message_getLastConversation' },{user:request.user});
  }


  @UseGuards(AuthGuard,RolesGuard)
  @Roles('CLIENT')
  @Get('getConversationAnnouncement/:id')
  getConversationAnnouncement(@Param('id') id: any, @Req() request:any){
    return this.client.send({ cmd: 'message_getConversationAnnouncement' },{id,user:request.user});
  }



  @UseGuards(AuthGuard,RolesGuard)
  @Roles('CLIENT')
  @Post('saveNewConversationAnnouncement')
  saveNewConversationAnnouncement(@Body() newConversation:any, @Req() request:any){
    return this.client.send({ cmd: 'message_saveNewConversationAnnouncement' }, {...newConversation, user:request.user});
  }


  @UseGuards(AuthGuard,RolesGuard)
  @Roles('CLIENT')
  @Get('getConversationParty/:id')
  getConversationParty(@Param('id') id: any, @Req() request:any){
    return this.client.send({ cmd: 'message_getConversationParty' },{id, user:request.user});
  }



  @UseGuards(AuthGuard,RolesGuard)
  @Roles('CLIENT')
  @Post('saveNewConversationParty')
  saveNewConversationParty(@Body() newConversation:any, @Req() request:any){
    return this.client.send({ cmd: 'message_saveNewConversationParty' }, {...newConversation, user:request.user});
  }


}