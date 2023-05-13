import { Injectable } from '@nestjs/common';
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
}
