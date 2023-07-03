import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Conversation } from './dto/conversation.dto';
import { newConversationAnnouncement } from './dto/newConversationAnnouncement.dto';
import { newConversationParty } from './dto/newConversationParty.dto';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {

  constructor(private supabaseService: SupabaseService) {}

  async getPartiesConversation(user:any){

    const { data, error } = await this.supabaseService.client
    .from('conversation')
    .select('user1(firstname,id, name), user2(firstname, id, name), id, party(name)')
    .not('partyId','is', null)
    .or(`user1.eq.${user.user[0].id},user2.eq.${user.user[0].id}`);

    
    return data

  }

  async getAnnouncementsConversation(user:any){

    const { data, error } = await this.supabaseService.client
        .from('conversation')
        .select('user1(firstname,id, name), user2(firstname, id, name), id, announcements(name)')
        .not('announcementId','is', null)
        .or(`user1.eq.${user.user[0].id},user2.eq.${user.user[0].id}`);
    return data
}

  async getMessagesByConversation(conversation:any){

    const getConversation = await this.getConversationById(conversation.id);

    if (getConversation.length == 0){ 
      return new HttpException({message : ["La conversation n'existe pas."]}, HttpStatus.NOT_FOUND);
    }

    const checkUserConversation = await this.checkUserConversation(conversation.id, conversation.user[0].id);

    if (checkUserConversation.length == 0){
      return new HttpException({message : ["Vous n'avez pas les droits"]}, HttpStatus.FORBIDDEN);
    }

    const { data, error } = await this.supabaseService.client
    .from('message')
    .select('message, sender(firstname, name,id)')
    .eq('convId',conversation.id);
    
    return data
  }


  async sendMessageParty(conversation:Conversation){

    const { data, error } = await this.supabaseService.client
    .from('message')
    .insert([
      {
        message: conversation.message,
        convId: conversation.convId,
        sender: conversation.user[0].id
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

  async checkUserConversation(id:string, userId:string){

    const { data, error } = await this.supabaseService.client
    .from('conversation')
    .select('id')
    .eq('id',id)
    .or(`user1.eq.${userId},user2.eq.${userId}`);

    return data;
  }

  async getLastConversation(user:any){

    const { data, error } = await this.supabaseService.client
    .from('conversation')
    .select('message(*), id')
    .or(`user1.eq.${user.user[0].id},user2.eq.${user.user[0].id}`);
    let latestDate = null;
    let latestConvId = null;
    if (data.length > 0){
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

    return 0;


  }


  async getConversationAnnouncement(conversation:any){
    
    const { data, error } = await this.supabaseService.client
    .from('conversation')
    .select('id')
    .eq('announcementId', conversation.id)
    .or(`user1.eq.${conversation.user[0].id},user2.eq.${conversation.user[0].id}`);
  
    return data;
  }

  async getAnnouncementById(id:string){

    const { data, error } = await this.supabaseService.client
    .from('announcements')
    .select('*')
    .eq('id', id)
    
    return data;
  }

  async getPartyById(id:string){

    const { data, error } = await this.supabaseService.client
    .from('party')
    .select('*')
    .eq('id', id)
    
    return data;
  }

  async checkConversationAnnouncement(id:string){
    const { data, error } = await this.supabaseService.client
    .from('conversation')
    .select('id')
    .eq('announcementId', id)
   
  
    return data;
  }

  async checkConversationParty(id:string){
    const { data, error } = await this.supabaseService.client
    .from('conversation')
    .select('id')
    .eq('partyId', id)
   
  
    return data;
  }

  async saveNewConversationAnnouncement(conversation:newConversationAnnouncement){

    const getAnnouncementById = await this.getAnnouncementById(conversation.id);

    if (getAnnouncementById.length == 0){
      return new HttpException({message : ["L'annonce n'existe pas."]}, HttpStatus.NOT_FOUND);
    }

    const checkConversation = await this.checkConversationAnnouncement(getAnnouncementById[0].id)

    if (checkConversation.length > 0){
      return new HttpException({message : ["La conversation existe déjà"]}, HttpStatus.BAD_REQUEST);
    }

    const { data, error } = await this.supabaseService.client
    .from('conversation')
    .insert([
      {
        announcementId: conversation.id,
        user1: conversation.user[0].id,
        user2: getAnnouncementById[0].profileId, 
      }
    ])
    .select()

    const { data:message } = await this.supabaseService.client
    .from('message')
    .insert([
      {
        message: conversation.message,
        convId: data[0].id,
        sender: conversation.user[0].id,

      }
    ])

    return { statusCode: 201, message: "Created" }


  }

  async getConversationParty(conversation:any){

    const { data, error } = await this.supabaseService.client
    .from('conversation')
    .select('id')
    .eq('partyId', conversation.id)
    .or(`user1.eq.${conversation.user[0].id},user2.eq.${conversation.user[0].id}`);
  
    return data;
  }


  async saveNewConversationParty(conversation:newConversationParty){

    const getPartyById = await this.getPartyById(conversation.id);

    if (getPartyById.length == 0){
      return new HttpException({message : ["La soirée n'existe pas."]}, HttpStatus.NOT_FOUND);
    }

    const checkConversation = await this.checkConversationParty(getPartyById[0].id)

    if (checkConversation.length > 0){
      return new HttpException({message : ["La conversation existe déjà"]}, HttpStatus.BAD_REQUEST);
    }

    const { data, error } = await this.supabaseService.client
    .from('conversation')
    .insert([
      {
        partyId: conversation.id,
        user1: conversation.user[0].id,
        user2: getPartyById[0].owner, 
      }
    ])
    .select()

    const { data:message } = await this.supabaseService.client
    .from('message')
    .insert([
      {
        message: conversation.message,
        convId: data[0].id,
        sender: conversation.user[0].id

      }
    ])

    return { statusCode: 201, message: "Created" }


  }



}
