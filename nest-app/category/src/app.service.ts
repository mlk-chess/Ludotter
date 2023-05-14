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

  async getCategoryByName(name:string){

    const { data: category } = await this.supabaseService.client
    .from('category')
    .select('*')
    .eq('name', name);

    return category;
  }
}
