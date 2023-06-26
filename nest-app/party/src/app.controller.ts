import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RpcValidationFilter } from './filters/rpc-exception.filter';
import { createPartyDto } from './dto/create-party.dto';
import { updatePartyDto } from './dto/update-party.dto';
import { joinPartyDto } from './dto/join-party.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern({ cmd: 'party_getParties' })
  getParties() {
    return this.appService.getParties();
  }

  @MessagePattern({ cmd: 'party_getParty' })
  getParty(id: any) {    
    return this.appService.getPartyById(id.id);
  }

  @MessagePattern({ cmd: 'party_getParticipants' })
  getParticipants(id: any) {    
    return this.appService.getParticipants(id.id);
  }

  @MessagePattern({ cmd: 'party_getAllPartipants' })
  getAllParticipants() {    
    return this.appService.getAllPartipants();
  }

  @MessagePattern({ cmd: 'party_saveParty' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  saveParty(createEvent: createPartyDto) {
    return this.appService.saveParty(createEvent);
  }

  @MessagePattern({ cmd: 'party_joinParty' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  joinParty(joinParty: joinPartyDto) {
    return this.appService.joinParty(joinParty);
  }

  @MessagePattern({ cmd: 'party_updateParty' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  updateParty(event: updatePartyDto) {
    return this.appService.updateParty(event);
  }

  @MessagePattern({ cmd: 'party_deleteParty' })
  @UseFilters(new RpcValidationFilter())
  deleteParty(id: string) {
    return this.appService.deleteParty(id);
  }


  
  @MessagePattern({ cmd: 'party_getPartiesConversation' })
  getPartiesConversation() {
    return this.appService.getPartiesConversation();
  }
}