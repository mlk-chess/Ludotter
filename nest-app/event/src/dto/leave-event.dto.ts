import { IsNumberString, IsUUID} from 'class-validator';

export class leaveEventDto{

    @IsNumberString({}, {message:"Erreur"})
    eventId: string;
}