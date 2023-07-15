import { IsNotEmpty, IsNumberString } from 'class-validator';

export class updateCategoryDto {

    @IsNumberString({}, {message:"Identifiant invalide"})
    id: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    name: string;

}