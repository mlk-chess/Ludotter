import { Transform } from 'class-transformer';
import { IsNotEmpty, Length, IsDate, IsDateString, isInt} from 'class-validator';

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
    time : string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    players: number

    @IsOptional()
    companyId?:number


    
}