import {IsNotEmpty, Length} from 'class-validator';

export class checkoutAnnouncementDto {
    @IsNotEmpty({message: 'Le champ id est vide'})
    id: string;

    @IsNotEmpty({message: 'Le champ number est vide'})
    @Length(16, 16)
    number: string;

    @IsNotEmpty({message: 'Le champ name est vide'})
    @Length(3)
    name: string;

    @IsNotEmpty({message: 'Le champ expiry est vide'})
    @Length(7, 7)
    expiry: string;

    @IsNotEmpty({message: 'Le champ cvc est vide'})
    @Length(3, 3)
    cvc: string;
}