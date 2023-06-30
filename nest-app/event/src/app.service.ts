import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { createEventDto } from './dto/create-event.dto';
import { updateEventDto } from './dto/update-event.dto';
import { SupabaseService } from './supabase/supabase.service';
import { joinEventDto } from './dto/join-event.dto';
import { leaveEventDto } from './dto/leave-event.dto';

@Injectable()
export class AppService {

  constructor(private supabaseService: SupabaseService) { }

  async getEventsAdmin() {

    const { data: events } = await this.supabaseService.client
      .from('events')
      .select('*, company(name,id)');

    return events;
  }

  async getEventsComing(){

    const today = new Date().toISOString().split('T')[0];;

    const { data: events } = await this.supabaseService.client
    .from('events')
    .select('*, company(name)')
    .gt('date', today)
    .eq("status", 1);

    return events;

  }

  async getMyEvents() {


  
    const { data: events } = await this.supabaseService.client
      .from('events')
      .select('*')
      .eq('companyId', 1)

      

    return events;
  }

  async saveEvent(newEvent: createEventDto) {


    if ( new Date(newEvent.date) < new Date()) {
      return new HttpException({ message: ["La date de l'événement ne peut pas être antérieure à la date actuelle."] }, HttpStatus.BAD_REQUEST);
    }

    const { error } = await this.supabaseService.client
      .from('events')
      .insert([{ 
        name: newEvent.name,
        description: newEvent.description,
        date: newEvent.date,
        time: newEvent.time,
        players: newEvent.players,
        companyId: 1, // CHANGER
        status : 1
      }]);

    if (error) {
      throw error;
    }
    return { statusCode: 201, message: "Created" }
  }



  async getEventById(id:string) {

    const { data: event } = await this.supabaseService.client
      .from('events')
      .select('*, company(name, address, city, zipcode)')
      .eq('id', id);

    return event
  }


  async updateEvent(updateEvent: updateEventDto) {

    const getEvent = await this.getEventById(updateEvent.id);
    const getUsersEvent = await this.getUsersByEvent(updateEvent.id);
    const countGetUsersEvent =  getUsersEvent.length;

    if (getEvent.length == 0) {
      return new HttpException({ message: ["L'évènement n'existe pas."] }, HttpStatus.BAD_REQUEST);
    }

    if (getEvent[0].status == -1) {
      return new HttpException({ message: ["Vous ne pouvez pas modifier un évènement annulé"] }, HttpStatus.BAD_REQUEST);
    }

    if (new Date(getEvent[0].date) < new Date()) {
      return new HttpException({ message: ["Vous ne pouvez pas modifier un évènement passé"] }, HttpStatus.BAD_REQUEST);
    }

    if ( new Date(updateEvent.date) < new Date()) {
      return new HttpException({ message: ["La date de l'événement ne peut pas être antérieure à la date actuelle."] }, HttpStatus.BAD_REQUEST);
    }

    if (countGetUsersEvent > updateEvent.players) {
      return new HttpException({ message: ["Vous ne pouvez pas modifier le nombre de personne."] }, HttpStatus.BAD_REQUEST);
    }

    const { error } = await this.supabaseService.client 
      .from('events')
      .update([{
         name: updateEvent.name,
         description: updateEvent.description,
         date: updateEvent.date,
         time: updateEvent.time,
         players: updateEvent.players,
        
      }])
      .eq('id', updateEvent.id);

    return { statusCode: 200, message: "Updated" }
  }

  async deleteEvent(id: string) {
    const getEvent = await this.getEventById(id);

    if (getEvent.length == 0) {
      return new HttpException({ message: ["L'évènement n'existe pas."] }, HttpStatus.NOT_FOUND);
    }

    const { data, error } = await this.supabaseService.client
      .from('events')
      .update([{
        status: -1
     }])
      .eq('id', id);

    return { statusCode: 204, message: "Deleted" }
  }

  async joinEvent(joinEvent:joinEventDto){

    const getEvent = await this.getEventById(joinEvent.eventId);

    if (getEvent.length == 0) {
      return new HttpException({ message: ["L'évènement n'existe pas."] }, HttpStatus.NOT_FOUND);
    }

    if (new Date(getEvent[0].date) < new Date()) {
      return new HttpException({ message: ["Vous ne pouvez pas rejoindre un évènement passé"] }, HttpStatus.BAD_REQUEST);
    }

    const getUsersByEvent = await this.getUsersByEvent(joinEvent.eventId);

    if (getUsersByEvent.length >= getEvent[0].players){
      return new HttpException({ message: ["Plus de place."] }, HttpStatus.BAD_REQUEST);
    }


    const { data } = await this.supabaseService.client
    .from('eventProfiles')
    .select('*')
    .eq('profileId', "72d1498a-3587-429f-8bec-3fafc0cd47bd")
    .eq('eventId', joinEvent.eventId)

    if (data.length > 0){
      return new HttpException({ message: ["Vous êtes déjà inscrit."] }, HttpStatus.BAD_REQUEST);
    }

    const { error } = await this.supabaseService.client
      .from('eventProfiles')
      .insert([{ 
          eventId: joinEvent.eventId,
          profileId: "72d1498a-3587-429f-8bec-3fafc0cd47bd"
      }]);
    

    return { statusCode: 201, message: "Created" }
  }



  async leaveEvent(leaveEvent:leaveEventDto){

    const getEvent = await this.getEventById(leaveEvent.eventId);

    if (getEvent.length == 0) {
      return new HttpException({ message: ["L'évènement n'existe pas."] }, HttpStatus.NOT_FOUND);
    }


    const { data } = await this.supabaseService.client
    .from('eventProfiles')
    .select('*')
    .eq('profileId', "72d1498a-3587-429f-8bec-3fafc0cd47bd")
    .eq('eventId', leaveEvent.eventId)

    if (data.length > 0){
      
        const { data } = await this.supabaseService.client
        .from('eventProfiles')
        .delete()
        .eq('profileId', "72d1498a-3587-429f-8bec-3fafc0cd47bd")
        .eq('eventId', leaveEvent.eventId);

        return { statusCode: 200, message: "Deleted" }

    }

    return new HttpException({ message: ["Vous n'êtes pas inscrit."] }, HttpStatus.NOT_FOUND);

  }


  async getUsersByEvent(id:string){

      const { data, error } = await this.supabaseService.client
      .from('eventProfiles')
      .select('profiles(name, firstname)')
      .eq('eventId', id);
      
      return data
  }

  async getUserByEvent(id:string){

    const { data, error } = await this.supabaseService.client
    .from('eventProfiles')
    .select('*')
    .eq('eventId', id)
    .eq('profileId','72d1498a-3587-429f-8bec-3fafc0cd47bd')
    
    return data
  }

  async getCompanies(){

    const { data, error } = await this.supabaseService.client
    .from('company')
    .select('*')
    .not('authId', "is",'null')

    return data
  }

  async saveEventAdmin(newEvent: createEventDto){

    const { error } = await this.supabaseService.client
      .from('events')
      .insert([{ 
        name: newEvent.name,
        description: newEvent.description,
        date: newEvent.date,
        time: newEvent.time,
        players: newEvent.players,
        companyId: newEvent.companyId,
        status : 1
      }]);

    if (error) {
      throw error;
    }
    return { statusCode: 201, message: "Created" }
  }

  
}