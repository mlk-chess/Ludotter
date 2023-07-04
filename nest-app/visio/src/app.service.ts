import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';
import {addDto} from "./dto/add.dto";

@Injectable()
export class AppService {

  constructor(private supabaseService: SupabaseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async add(data: addDto) {
    console.log(data);
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

    console.log('endtime est supérieur de 60 minutes à starttime.');
    return {statusCode: 201, message: 'Created'};
  }
}
