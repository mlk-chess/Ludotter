import {IsNotEmpty} from 'class-validator';

export class deleteAnnouncementDto {
    @IsNotEmpty({message: 'Le champ id est vide'})
    id: string;

    @IsNotEmpty({message: 'Le champ user est vide'})
    user: any;
}