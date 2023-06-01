import { IsNotEmpty, IsNumberString } from 'class-validator';

export class updatePartyDto {

    @IsNumberString({}, {message:"Soirée invalide"})
    id: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    name: string;

}