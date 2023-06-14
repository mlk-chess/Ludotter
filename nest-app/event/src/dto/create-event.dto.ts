import { IsNotEmpty, Length, IsDate, IsDateString } from 'class-validator';

export class createEventDto {

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    name: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    description: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsDate()
    date: Date;

    @IsDateString()
    time : string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    players: number


    
}