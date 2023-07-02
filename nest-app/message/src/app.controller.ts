import { Controller, Get, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RpcValidationFilter } from './filters/rpc-exception.filter';
import { Conversation } from './dto/conversation.dto';
import { newConversationAnnouncement } from './dto/newConversationAnnouncement.dto';
import { newConversationParty } from './dto/newConversationParty.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @MessagePattern({ cmd: 'message_getAnnouncementsConversation' })
  getAnnouncementsConversation(user:any){
    return this.appService.getAnnouncementsConversation(user);
  }


  @MessagePattern({ cmd: 'message_getPartiesConversation' })
  getPartiesConversation(user:any) {
    return this.appService.getPartiesConversation(user);
  }x

  @MessagePattern({ cmd: 'message_getMessagesByConversation' })
  getMessagesByConversation(conversation:any) {
    return this.appService.getMessagesByConversation(conversation);
  }


  @MessagePattern({ cmd: 'message_sendMessageParty' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  sendMessageParty(conversation: Conversation) {
    return this.appService.sendMessageParty(conversation);
  }

  @MessagePattern({ cmd: 'message_getLastConversation' })
  getLastConversation(user:any){
    return this.appService.getLastConversation(user);
  }

  @MessagePattern({ cmd: 'message_getConversationAnnouncement' })
  getConversationAnnouncement(conversation:any){
    return this.appService.getConversationAnnouncement(conversation);
  }


  @MessagePattern({ cmd: 'message_saveNewConversationAnnouncement' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  saveNewConversationAnnouncement(newConversation:newConversationAnnouncement){
    return this.appService.saveNewConversationAnnouncement(newConversation);
  }


  @MessagePattern({ cmd: 'message_getConversationParty' })
  getConversationParty(conversation:any){
    return this.appService.getConversationParty(conversation);
  }


  @MessagePattern({ cmd: 'message_saveNewConversationParty' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  saveNewConversationParty(newConversation:newConversationParty){
    return this.appService.saveNewConversationParty(newConversation);
  }
}
