import { Controller, Get, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { createCompanyDto } from './dto/create-company.dto';
import { RpcValidationFilter } from './filters/rpc-exception.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'company_getCompanies' })
  getCompanies() {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'company_saveCompany' })
  @UseFilters(new RpcValidationFilter())
  saveCompany(createCompany: createCompanyDto) {
    return this.appService.saveCompany(createCompany);
  }

}
