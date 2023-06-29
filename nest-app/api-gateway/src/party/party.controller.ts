import { Controller, Post, Get, Inject, Param, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('party')
export class PartyController {

  constructor(@Inject('PARTY_SERVICE') private client: ClientProxy) { }

  @Get('')
  @UseGuards(AuthGuard) 
  @Roles('ADMIN','CLIENT')
  getParties() {
    return this.client.send({ cmd: 'party_getParties' }, {});
  }

  @Get('all-participants')
  @UseGuards(AuthGuard) 
  @Roles('ADMIN','CLIENT')
  getAllParticipants() {
    return this.client.send({ cmd: 'party_getAllPartipants' }, {});
  }

  @Get('participants/:id')
  @UseGuards(AuthGuard) 
  @Roles('ADMIN','CLIENT')
  getParticipants(@Param('id') id: any) {
    return this.client.send({ cmd: 'party_getParticipants' }, { id });
  }

  @Get(':id')
  @UseGuards(AuthGuard) 
  @Roles('ADMIN','CLIENT')
  getParty(@Param('id') id: any) {
    return this.client.send({ cmd: 'party_getParty' }, { id });
  }

  @Patch('refuse')
  @UseGuards(AuthGuard) 
  @Roles('ADMIN','CLIENT')
  declineParticipant(@Body() party: any) {
    console.log(party);

    return this.client.send({ cmd: 'party_declineParticipant' }, party);
  }

  @Patch('confirm')
  @UseGuards(AuthGuard) 
  @Roles('ADMIN','CLIENT')
  acceptParticipant(@Body() party: any) {
    return this.client.send({ cmd: 'party_acceptParticipant' }, party);
  }

  @Post('save')
  @UseGuards(AuthGuard) 
  @Roles('ADMIN','CLIENT')
  saveParty(@Body() party: any) {
    return this.client.send({ cmd: 'party_saveParty' }, party);
  }

  @Post('join')
  @UseGuards(AuthGuard) 
  @Roles('ADMIN','CLIENT')
  joinParty(@Body() party: any) {
    return this.client.send({ cmd: 'party_joinParty' }, party);
  }

  @Patch(':id')
  @UseGuards(AuthGuard) 
  @Roles('ADMIN','CLIENT')
  updateParty(@Param('id') id: string, @Body() party: any) {
    return this.client.send({ cmd: 'party_updateParty' }, { ...party, id });
  }

  @Delete(':id')
  @UseGuards(AuthGuard) 
  @Roles('ADMIN','CLIENT')
  deleteParty(@Param('id') id: string) {
    return this.client.send({ cmd: 'party_deleteParty' }, id);
  }

  // method to leave a party
  @Post('leave')
  @UseGuards(AuthGuard) 
  @Roles('ADMIN','CLIENT')
  leaveParty(@Body() party: any) {
    return this.client.send({ cmd: 'party_leaveParty' }, party);
  }

}