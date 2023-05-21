import {IsNotEmpty} from 'class-validator';

export class createAnnouncementDto {
    @IsNotEmpty({message: 'Le champ nom est vide'})
    name: string;

    @IsNotEmpty({message: "Le champ prix est vide"})
    price: number;

    @IsNotEmpty({message: "Le champ description est vide"})
    description: string;

    @IsNotEmpty({message: "Le champ image est vide"})
    selectImages: any;
}