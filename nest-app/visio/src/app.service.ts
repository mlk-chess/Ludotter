import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';
import {addDto} from "./dto/add.dto";

@Injectable()
export class AppService {

  constructor(private supabaseService: SupabaseService) {}

  async getHello(data) {
    const {data: visio, error} = await this.supabaseService.client
        .from('visio')
        .select('date, startTime')
        .eq('profileId', data.user[0].id);

    if (error) {
      return new HttpException({message: ["Une erreur est survenue"]}, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (visio === null) {
      return []
    } else {
      const newVisio = visio.map(({
                                                startTime: title,
                                              ...rest
                                            }) => ({
          title,
        ...rest
      }));

      return newVisio;
    }
  }

  async add(data: addDto) {
    const startTime = new Date(`2000/01/01 ${data.startTime}`);
    const endTime = new Date(`2000/01/01 ${data.endTime}`);

    const startTime_60 = new Date(startTime.getTime() + (60 * 60000));

    if (endTime < startTime_60) {
      return new HttpException({message: ["L'heure de fin doit être au minimum 1h après la date de début"]}, HttpStatus.BAD_REQUEST);
    }

    const date = new Date(data.date);

    const today = new Date();

    if (date <= today) {
      return new HttpException({message: ["La date doit être supérieure à aujourd'hui"]}, HttpStatus.BAD_REQUEST);
    }

    const {data:visio , error} = await this.supabaseService.client
        .from('visio')
        .insert([{
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          profileId: data.user[0].id,
        }])
        .select();

    if (error) {
      return new HttpException({message: ["Une erreur est survenue pendant la création de la disponibilité"]}, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {statusCode: 201, message: 'Created'};
  }
}
