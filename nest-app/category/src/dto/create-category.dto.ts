import { IsNotEmpty, Length } from 'class-validator';

export class createCategoryDto {

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    name: string;

}