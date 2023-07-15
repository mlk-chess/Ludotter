import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [],
  providers: [],
  exports: [SupabaseService],
})
export class SupabaseModule {}