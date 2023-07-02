import { Transform } from 'class-transformer';
import { IsNotEmpty, Length, IsDate, IsDateString, isInt, IsOptional, Matches} from 'class-validator';

export class createEventDto {

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

    @IsOptional()
    companyId?:number

    @IsNotEmpty()
    user:any

    
}