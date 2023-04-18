import { Injectable } from '@nestjs/common';
import { SupabaseService } from './common/supabase/supabase.service';


@Injectable()
export class AppService {
  constructor(private supabaseService: SupabaseService) {}

  async test(){
    
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email: 'example@email.com',
      password: 'example-password',
    });

    if (error) {
      throw error;
    }
    return data;
  }
}
