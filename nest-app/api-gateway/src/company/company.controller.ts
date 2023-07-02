import { Controller, Post, Get, Inject, Param, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Controller('company')
export class CompanyController {

  constructor(@Inject('COMPANY_SERVICE') private client: ClientProxy) {}

  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN')
  @Get('companies')
  getCompanies() {
    return this.client.send({ cmd: 'company_getCompanies' },{});
  }
  

  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN')
  @Get('request')
  getRequestCompany() {
    return this.client.send({ cmd: 'company_getRequestCompany' },{});
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN')
  @Post('saveCompanyAdmin')
  saveCompanyAdmin(@Body() company:any){
    return this.client.send({ cmd: 'company_saveCompanyAdmin' }, company);
  }
  

  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN')
  @Patch('updateCompanyAdmin/:id')
  updateCompanyAdmin(@Param('id') id: string, @Body() company:any) {
    return this.client.send({ cmd: 'company_updateCompanyAdmin' },{...company,id});
  }

  @Post('')
  saveCompany(@Body() company: any) {
    return this.client.send({ cmd: 'company_saveCompany' }, company);
  }


  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN')
  @Patch('accept/:id')
  acceptCompany(@Param('id') id: string){
    return this.client.send({ cmd: 'company_acceptCompany' },id);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteCompany(@Param('id') id: string){
    return this.client.send({ cmd: 'company_deleteCompany' },id);
  }

}