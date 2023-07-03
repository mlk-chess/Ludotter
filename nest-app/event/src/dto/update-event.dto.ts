import { Transform } from 'class-transformer';
import { IsNotEmpty, Length, IsDate, IsDateString, isInt, IsNumberString, Matches} from 'class-validator';

export class updateEventDto {

    @IsNotEmpty({message:"Le champ nom est vide."})
    name: string;

    @IsNotEmpty({message:"Le champ description est vide."})
    description: string;

    @IsNotEmpty({message:"Le champ date est vide."})
    @Transform( ({ value }) => value && new Date(value))
    @IsDate()
    date: Date;

    @IsNotEmpty({message:"Le champ heure est vide."})
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    time : string;

    @IsNotEmpty({message:"Il faut minimum 1 joueur."})
    players: number

    @IsNumberString({}, {message:"Identifiant invalide"})
    id: string;

    @IsNotEmpty()
    user:any

}