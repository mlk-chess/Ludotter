import { Transform } from 'class-transformer';
import { IsNotEmpty, Length, IsDate, IsDateString, isInt, IsNumberString, Matches} from 'class-validator';

export class updateEventDto {

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    name: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    description: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @Transform( ({ value }) => value && new Date(value))
    @IsDate()
    date: Date;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    time : string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    players: number

    @IsNumberString({}, {message:"Identifiant invalide"})
    id: string;

    @IsNotEmpty()
    user:any

}