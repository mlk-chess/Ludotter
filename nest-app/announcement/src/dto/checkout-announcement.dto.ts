import {IsNotEmpty, Max, Min} from 'class-validator';

export class deleteAnnouncementDto {
    @IsNotEmpty({message: 'Le champ id est vide'})
    id: string;

    @IsNotEmpty({message: 'Le champ number est vide'})
    @Max(16)
    @Min(16)
    number: string;

    @IsNotEmpty({message: 'Le champ name est vide'})
    @Min(3)
    name: string;

    @IsNotEmpty({message: 'Le champ expiry est vide'})
    @Max(5)
    @Min(5)
    expiry: string;

    @IsNotEmpty({message: 'Le champ cvc est vide'})
    @Max(3)
    @Min(3)
    cvc: string;
}