import { IsNotEmpty, IsNumberString, IsUUID} from 'class-validator';

export class joinEventDto{

    @IsNumberString({}, {message:"Erreur"})
    eventId: string;

    @IsNotEmpty()
    user:any

}