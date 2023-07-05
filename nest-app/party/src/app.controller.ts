import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RpcValidationFilter } from './filters/rpc-exception.filter';
import { createPartyDto } from './dto/create-party.dto';
import { updatePartyDto } from './dto/update-party.dto';
import { joinPartyDto } from './dto/join-party.dto';
import { createPartyAdminDto } from './dto/create-party-admin.dto';
import { updatePartyAdminDto } from './dto/update-party-admin.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @MessagePattern({ cmd: 'party_getParties' })
  getParties() {
    return this.appService.getParties();
  }

  // Get my parties
  @MessagePattern({ cmd: 'party_getMyParties' })
  getMyParties(user: any) {
    return this.appService.getMyParties(user);
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

  // method to leave a party
  @MessagePattern({ cmd: 'party_leaveParty' })
  @UseFilters(new RpcValidationFilter())
  leaveParty(id: string) {
    return this.appService.leaveParty(id);
  }

  @MessagePattern({ cmd: 'party_declineParticipant' })
  @UseFilters(new RpcValidationFilter())
  declineParticipant(idParty: any) {
    return this.appService.declineParticipant(idParty);
  }

  @MessagePattern({ cmd: 'party_acceptParticipant' })
  @UseFilters(new RpcValidationFilter())
  acceptParticipant(idParty: any) {
    return this.appService.acceptParticipant(idParty);
  }

  // Admin
  // Save a party by admin
  @MessagePattern({ cmd: 'party_savePartyAdmin' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  savePartyAdmin(createEvent: createPartyAdminDto) {
    return this.appService.savePartyAdmin(createEvent);
  }

  // Update a party by admin
  @MessagePattern({ cmd: 'party_updatePartyAdmin' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  updatePartyAdmin(event: updatePartyAdminDto) {
    return this.appService.updatePartyAdmin(event);
  }
  
}