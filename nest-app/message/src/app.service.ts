import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    const getConversation = await this.getConversationById(id);

    if (getConversation.length == 0){
      return new HttpException({message : ["La conversation n'existe pas."]}, HttpStatus.NOT_FOUND);
    }

    const checkUserConversation = await this.checkUserConversation(id);

    if (checkUserConversation.length == 0){
      return new HttpException({message : ["Vous n'avez pas les droits"]}, HttpStatus.FORBIDDEN);
    }

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



  async getConversationById(id:string){

    const { data, error } = await this.supabaseService.client
    .from('conversation')
    .select('id')
    .eq('id',id);
    
    return data
  }

  async checkUserConversation(id:string){

    const { data, error } = await this.supabaseService.client
    .from('conversation')
    .select('id')
    .eq('id',id)
    .or('user1.eq.72d1498a-3587-429f-8bec-3fafc0cd47bd,user2.eq.72d1498a-3587-429f-8bec-3fafc0cd47bd');

    return data;
  }

  async getLastConversation(){

    const { data, error } = await this.supabaseService.client
    .from('conversation')
    .select('message(*), id')
    .or('user1.eq.72d1498a-3587-429f-8bec-3fafc0cd47bd,user2.eq.72d1498a-3587-429f-8bec-3fafc0cd47bd');

    let latestDate = null;
    let latestConvId = null;

    data.forEach((obj) => {
      const messages = obj.message;
      if (messages.length > 0) {
        const sortedMessages = messages.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        });
        const latestMessage = sortedMessages[0];
        if (!latestDate || new Date(latestMessage.created_at).getTime() > latestDate) {
          latestDate = new Date(latestMessage.created_at).getTime();
          latestConvId = latestMessage.convId;
        }
      }
    });
    
    return latestConvId;

  }


}
