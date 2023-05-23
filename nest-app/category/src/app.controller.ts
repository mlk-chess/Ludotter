import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RpcValidationFilter } from './filters/rpc-exception.filter';
import { createCategoryDto } from './dto/create-category.dto';
import { updateCategoryDto } from './dto/update-category.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'category_getCategories' })
  getCategories() {
    return this.appService.getCategories();
  }

  @MessagePattern({ cmd: 'category_saveCategory' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  saveCategory(createCategory: createCategoryDto) {
    return this.appService.saveCategory(createCategory);
  }


  @MessagePattern({ cmd: 'category_updateCategory' })
  @UsePipes(ValidationPipe)
  @UseFilters(new RpcValidationFilter())
  updateCategory(category:updateCategoryDto){
    return this.appService.updateCategory(category);
  }


}
