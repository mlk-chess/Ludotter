import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { createCategoryDto } from './dto/create-category.dto';
import { updateCategoryDto } from './dto/update-category.dto';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {


  constructor(private supabaseService: SupabaseService) {}

  async getCategories() {

    const { data: categories } = await this.supabaseService.client
    .from('category')
    .select('*');

    return categories;
  }

  async saveCategory(newCategory : createCategoryDto){

    const getCategory = await this.getCategoryByName(newCategory.name.toLowerCase());
    
    if (getCategory.length > 0){
      return new HttpException({message : ["Cette catégorie existe déjà."]}, HttpStatus.BAD_REQUEST);
    }

    const { error } =  await this.supabaseService.client
    .from('category')
    .insert([{ name: newCategory.name.toLowerCase()}]);

    if (error) {
        throw error;
    }

    return { statusCode : 201, message : "Created"}
  }

  async getCategoryByName(name:string){

    const { data: category } = await this.supabaseService.client
    .from('category')
    .select('*')
    .eq('name', name);

    return category;
  }

  async getCategoryById(id:string){

    const { data: category } = await this.supabaseService.client
    .from('category')
    .select('*')
    .eq('id', id);

    return category
   
  }

  async updateCategory(updateCategory:updateCategoryDto){

    const getCategory = await this.getCategoryById(updateCategory.id);

    if (getCategory.length == 0){
      return new HttpException({message : ["La catégorie n'existe pas."]}, HttpStatus.NOT_FOUND);
    }
    
    if (getCategory[0].name !== updateCategory.name.toLowerCase()){
      const existingCategory = await this.getCategoryByName(updateCategory.name.toLowerCase());

      if (existingCategory.length > 0) {
        return new HttpException({message : ["Cette catégorie existe déjà."]}, HttpStatus.BAD_REQUEST);
      }
    }

    const { error } =  await this.supabaseService.client
    .from('category')
    .update([{ name: updateCategory.name.toLowerCase()}])
    .eq('id', updateCategory.id);


    return { statusCode : 200, message : "Updated"}

  }

  async deleteCategory(id: string) {

    const getCategory = await this.getCategoryById(id);

    if (getCategory.length == 0){
      return new HttpException({message : ["La catégorie n'existe pas."]}, HttpStatus.NOT_FOUND);
    }

    
    const {data, error } =  await this.supabaseService.client
    .from('category')
    .delete()
    .eq('id', id);

    return { statusCode : 204, message : "Deleted"}

  }

}
