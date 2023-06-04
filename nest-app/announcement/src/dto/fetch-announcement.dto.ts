import {IsNotEmpty} from 'class-validator';

export class fetchAnnouncementsDto {
    @IsNotEmpty({message: 'Le champ from est vide'})
    from: string;

    @IsNotEmpty({message: 'Le champ to est vide'})
    to: string;
}