import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { createCompanyDto } from './dto/create-company.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'company_getCompanies' })
  getCompanies() {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'company_saveCompany' })
  saveCompany(createCompany: createCompanyDto) {
    return this.appService.saveCompany(createCompany);
  }

}
