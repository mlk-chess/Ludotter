import { Injectable } from '@nestjs/common';
import { createCompanyDto } from './dto/create-company.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async saveCompany(company: createCompanyDto){
    return 'OK';
  }
}
