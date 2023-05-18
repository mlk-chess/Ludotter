import { Controller, Post, Get, Inject, Param, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('category')
export class CategoryController {

  constructor(@Inject('CATEGORY_SERVICE') private client: ClientProxy) {}


  @Get('')
  getCategories() {
    return this.client.send({ cmd: 'category_getCategories' },{});
  }

  @Post('save')
  saveCategory(@Body() category:any){
    return this.client.send({ cmd: 'category_saveCategory' }, category);
  }

}