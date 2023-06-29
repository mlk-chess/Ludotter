import { Controller, Post, Get, Inject, Param, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Controller('category')
export class CategoryController {

  
  constructor(@Inject('CATEGORY_SERVICE') private client: ClientProxy) {}

  
  
  @Get('')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  getCategories() {
    return this.client.send({ cmd: 'category_getCategories' },{});
  }

  @Post('save')
  saveCategory(@Body() category:any){
    return this.client.send({ cmd: 'category_saveCategory' }, category);
  }

  @Patch(':id')
  updateCategory(@Param('id') id: string, @Body() category:any){
    return this.client.send({ cmd: 'category_updateCategory' },{...category,id});
  }

  @Delete(':id')
  deleteCategory(@Param('id') id: string){
    return this.client.send({ cmd: 'category_deleteCategory' },id);
  }


}