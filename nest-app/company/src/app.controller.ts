import { Controller, Get, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { createCompanyDto } from './dto/create-company.dto';
import { RpcValidationFilter } from './filters/rpc-exception.filter';
import { updateCompanyDto } from './dto/update-company.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'company_getCompanies' })
  getCompanies() {
    return this.appService.getCompanies();
  }

  @MessagePattern({ cmd: 'company_getRequestCompany' })
  getRequestCompany() {
    return this.appService.getRequestCompany();
  }

  @MessagePattern({ cmd: 'company_saveCompany' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  saveCompany(createCompany: createCompanyDto) {
    return this.appService.saveCompany(createCompany);
  }

  @MessagePattern({ cmd: 'company_deleteCompany' })
  @UseFilters(new RpcValidationFilter())
  deleteCompany(id:string){
    return this.appService.deleteCompany(id);
  }

  @MessagePattern({ cmd: 'company_saveCompanyAdmin' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  saveCompanyAdmin(createCompany: createCompanyDto) {
    return this.appService.saveCompanyAdmin(createCompany);
  }

  @MessagePattern({ cmd: 'company_acceptCompany' })
  @UseFilters(new RpcValidationFilter())
  acceptCompany(id:string) {
    return this.appService.acceptCompany(id);
  }

  @MessagePattern({ cmd: 'company_updateCompanyAdmin' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  updateCompanyAdmin(updateCompanyAdmin: updateCompanyDto){
    return this.appService.updateCompanyAdmin(updateCompanyAdmin);
  }
}
