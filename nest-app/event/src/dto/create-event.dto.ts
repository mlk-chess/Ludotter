import { IsNotEmpty, Length } from 'class-validator';

export class createEventDto {
    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    name: string;
}