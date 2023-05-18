import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { createCategoryDto } from './dto/create-category.dto';
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

    const getCategory = await this.getCategoryByName(newCategory.name);
    
    if (getCategory.length > 0){
      return new HttpException({message : ["Cette catégorie existe déjà."]}, HttpStatus.BAD_REQUEST);
    }

    return { codeStatus : 201, message : "Created"}
  }

  async getCategoryByName(name:string){

    const { data: category } = await this.supabaseService.client
    .from('category')
    .select('*')
    .eq('name', name);

    return category;
  }
}
