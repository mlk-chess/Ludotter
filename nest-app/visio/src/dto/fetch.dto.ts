import {IsNotEmpty} from 'class-validator';

export class fetchDto {
    @IsNotEmpty({message: 'Le champ from est vide'})
    user: any;
}