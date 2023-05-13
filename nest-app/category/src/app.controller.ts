import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RpcValidationFilter } from './filters/rpc-exception.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'category_getCategories' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  getCategories() {
    return this.appService.getCategories();
  }
}
