import { IsNotEmpty, IsNumberString, IsUUID} from 'class-validator';

export class leaveEventDto{

    @IsNumberString({}, {message:"Erreur"})
    eventId: string;

    @IsNotEmpty()
    user:any

}