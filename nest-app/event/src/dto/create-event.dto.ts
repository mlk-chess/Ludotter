import { Transform } from 'class-transformer';
import { IsNotEmpty, Length, IsDate, IsDateString, isInt, IsOptional, Matches, Min, IsInt} from 'class-validator';

export class createEventDto {

    @IsNotEmpty({message:"Le champ nom est vide."})
    name: string;

    @IsNotEmpty({message:"Le champ description est vide."})
    description: string;

    @IsNotEmpty({message:"Le champ date est vide."})
    @Transform( ({ value }) => value && new Date(value))
    @IsDate()
    date: Date;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    time : string;

    @IsNotEmpty({message:"Il faut minimum 1 joueur."})
    players: number

    @IsOptional()
    companyId?:number

    @IsNotEmpty()
    user?:any

    
}