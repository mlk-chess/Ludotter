import { Transform } from 'class-transformer';
import { IsNotEmpty, Length, IsDate, IsDateString, isInt, IsNumberString, IsUUID} from 'class-validator';

export class joinEventDto{

    @IsNumberString({}, {message:"Erreur"})
    eventId: string;

    @IsUUID()
    profileId:string

}