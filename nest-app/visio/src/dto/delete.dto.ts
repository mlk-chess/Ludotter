import {IsNotEmpty} from 'class-validator';
export class deleteDto {
    @IsNotEmpty({message: 'Le champ date est vide'})
    id: string;

    @IsNotEmpty({message: "Le champ user est vide"})
    user: any;
}