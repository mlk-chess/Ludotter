import { Controller, Post, Get, Inject, Param, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('company')
export class CompanyController {

  constructor(@Inject('COMPANY_SERVICE') private client: ClientProxy) {}


  @Get('')
  getCompanies() {
    return this.client.send({ cmd: 'company_getCompanies' },{});
  }

  @Post('')
  saveCompany(@Body() company: any) {
    return this.client.send({ cmd: 'company_saveCompany' }, company);
  }

}