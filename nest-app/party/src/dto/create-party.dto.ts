import { IsNotEmpty, Length } from 'class-validator';

export class createPartyDto {
    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    name: string;
}