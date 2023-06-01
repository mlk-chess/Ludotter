import { Controller, Post, Get, Inject, Param, Body, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('party')
export class PartyController {

  constructor(@Inject('PARTY_SERVICE') private client: ClientProxy) {}

  @Get('')
  getParties() {
    return this.client.send({ cmd: 'party_getParty' },{});
  }

  @Post('save')
  saveParty(@Body() party:any){
    return this.client.send({ cmd: 'party_saveParty' }, party);
  }

  @Patch(':id')
  updateParty(@Param('id') id: string, @Body() party:any){
    return this.client.send({ cmd: 'party_updateParty' },{...party,id});
  }

  @Delete(':id')
  deleteParty(@Param('id') id: string){
    return this.client.send({ cmd: 'party_deleteParty' },id);
  }

}