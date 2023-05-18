import { IsNotEmpty, Length } from 'class-validator';

export class createAnnouncementDto {

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    name: string;

}