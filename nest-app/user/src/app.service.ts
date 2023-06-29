import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {

  constructor(private supabaseService: SupabaseService) { }

  // Get all users
  async getAllUsers() {
    const { data: Users } = await this.supabaseService.client
      .from('profiles')
      .select('*');

    return {Users, statusCode: 200, message: "OK"};
  }
}
