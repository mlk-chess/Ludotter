import { Injectable } from '@nestjs/common';
import { Conversation } from './dto/conversation.dto';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {

  constructor(private supabaseService: SupabaseService) {}
  
  test(): string {
    return 'Hello World!';
  }

  async getPartiesConversation(){

    const { data, error } = await this.supabaseService.client
    .from('conversation')
    .select('user1(firstname,id, name), user2(firstname, id, name), id, party(name)')
    .not('partyId','is', null)
    .or('user1.eq.72d1498a-3587-429f-8bec-3fafc0cd47bd,user2.eq.72d1498a-3587-429f-8bec-3fafc0cd47bd');
    
    return data

  }

  async getAnnouncementsConversation(){
    const { data, error } = await this.supabaseService.client
        .from('conversation')
        .select('user1(firstname,id, name), user2(firstname, id, name), id, announcements(name)')
        .not('announcementId','is', null)
        .or('user1.eq.72d1498a-3587-429f-8bec-3fafc0cd47bd,user2.eq.72d1498a-3587-429f-8bec-3fafc0cd47bd');

    return data
}

  async getMessagesByConversation(id:string){

    const { data, error } = await this.supabaseService.client
    .from('message')
    .select('message, sender(firstname, name,id)')
    .eq('convId',id);
    
    return data
  }


  async sendMessageParty(conversation:Conversation){

    const { data, error } = await this.supabaseService.client
    .from('message')
    .insert([
      {
        message: conversation.message,
        convId: conversation.convId,
        sender: '72d1498a-3587-429f-8bec-3fafc0cd47bd'
      }
    ])

    return { statusCode: 201, message: "Created" }
  }
}
