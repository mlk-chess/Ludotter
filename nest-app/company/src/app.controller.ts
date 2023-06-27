import { Controller, Get, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { createCompanyDto } from './dto/create-company.dto';
import { RpcValidationFilter } from './filters/rpc-exception.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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

}
