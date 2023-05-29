import { IsNotEmpty, IsNumberString } from 'class-validator';

export class updateEventDto {

    @IsNumberString({}, {message:"Evènement invalide"})
    id: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    name: string;

}