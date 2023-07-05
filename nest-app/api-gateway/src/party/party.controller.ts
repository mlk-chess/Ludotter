import { Controller, Post, Get, Inject, Param, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Controller('party')
export class PartyController {

  constructor(@Inject('PARTY_SERVICE') private client: ClientProxy) { }

  @Get('')
  getParties() {
    return this.client.send({ cmd: 'party_getParties' }, {});
  }

  @Get('all-participants')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  getAllParticipants() {
    return this.client.send({ cmd: 'party_getAllPartipants' }, {});
  }

  @Get('participants/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  getParticipants(@Param('id') id: any) {
    return this.client.send({ cmd: 'party_getParticipants' }, { id });
  }

  @Get(':id')
  getParty(@Param('id') id: any) {
    return this.client.send({ cmd: 'party_getParty' }, { id });
  }

  @Patch('refuse')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  declineParticipant(@Body() party: any) {
    return this.client.send({ cmd: 'party_declineParticipant' }, party);
  }

  @Patch('confirm')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  acceptParticipant(@Body() party: any) {
    return this.client.send({ cmd: 'party_acceptParticipant' }, party);
  }

  @Post('save')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  saveParty(@Body() party: any) {
    return this.client.send({ cmd: 'party_saveParty' }, party);
  }

  // method to save a party as admin
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/save')
  savePartyAdmin(@Body() party: any) {
    return this.client.send({ cmd: 'party_savePartyAdmin' }, party);
  }

  @Post('join')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  joinParty(@Body() party: any) {
    return this.client.send({ cmd: 'party_joinParty' }, party);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  updateParty(@Param('id') id: string, @Body() party: any) {
    return this.client.send({ cmd: 'party_updateParty' }, { ...party, id });
  }

  // method to update a party as admin
  @Patch('admin/update/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  updatePartyAdmin(@Param('id') id: string, @Body() party: any) {
    return this.client.send({ cmd: 'party_updatePartyAdmin' }, { ...party, id });
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  deleteParty(@Param('id') id: string) {
    return this.client.send({ cmd: 'party_deleteParty' }, id);
  }

  // method to leave a party
  @Post('leave')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  leaveParty(@Body() party: any) {
    return this.client.send({ cmd: 'party_leaveParty' }, party);
  }

}