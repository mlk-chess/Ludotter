import {IsNotEmpty} from 'class-validator';
export class addDto {
    @IsNotEmpty({message: 'Le champ date est vide'})
    date: string;

    @IsNotEmpty({message: 'Le champ startTime est vide'})
    startTime: string;

    @IsNotEmpty({message: 'Le champ endTime est vide'})
    endTime: string;

    @IsNotEmpty({message: "Le champ user est vide"})
    user: any;
}