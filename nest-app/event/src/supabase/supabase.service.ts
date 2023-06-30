import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {

  constructor(private configService: ConfigService) {}

  private supabaseUrl = this.configService.get<string>('SUPABASE_URL');
  private supabaseKey = this.configService.get<string>('SUPABASE_KEY');

  private supabaseClient = createClient(this.supabaseUrl, this.supabaseKey);

  get client() {
    return this.supabaseClient;
  }
}