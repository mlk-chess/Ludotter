import { IsNumberString, IsUUID} from 'class-validator';

export class joinEventDto{

    @IsNumberString({}, {message:"Erreur"})
    eventId: string;

    @IsUUID()
    profileId:string

}