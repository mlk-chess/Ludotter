import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {

  constructor(private supabaseService: SupabaseService) { }

  // Get all users
  async getAllUsers() {
    const { data: Parties } = await this.supabaseService.client
      .from('party')
      .select('*');

    return {Parties, statusCode: 200, message: "OK"};
  }
}
