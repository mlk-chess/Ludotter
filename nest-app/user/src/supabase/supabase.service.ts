import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {

  constructor(private configService: ConfigService) {}

  private supabaseUrl = this.configService.get<string>('SUPABASE_URL');
  private supabaseKey = this.configService.get<string>('SUPABASE_KEY');
  private supabaseServiceRole = this.configService.get<string>('SUPABASE_SERVICE_ROLE');

  private supabaseClient = createClient(this.supabaseUrl, this.supabaseKey);
  private supabase = createClient(this.supabaseUrl, this.supabaseServiceRole);

  get client() {
    return this.supabaseClient;
  }

  get adminAuthClient(){
    return this.supabase.auth.admin;
  }
}