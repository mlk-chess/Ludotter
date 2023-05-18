import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { createAnnouncementDto } from './dto/create-announcement.dto';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {

  constructor(private supabaseService: SupabaseService) {}

  async saveAnnouncement(newAnnouncement : createAnnouncementDto){
    return { codeStatus : 201, message : "Created"}
  }
}
