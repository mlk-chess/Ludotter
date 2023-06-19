import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { createEventDto } from './dto/create-event.dto';
import { updateEventDto } from './dto/update-event.dto';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {

  constructor(private supabaseService: SupabaseService) { }

  async getEvents() {

    const { data: events } = await this.supabaseService.client
      .from('events')
      .select('*');

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
      .select('*')
      .eq('id', id);

    return event
  }

  async updateEvent(updateEvent: updateEventDto) {
    const getEvent = await this.getEventById(updateEvent.id);

    if (getEvent.length == 0) {
      return new HttpException({ message: ["L'évènement n'existe pas."] }, HttpStatus.NOT_FOUND);
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

}
