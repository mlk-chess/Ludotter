import {IsIn, IsNotEmpty} from 'class-validator';

export class updateCheckoutDto {
    @IsNotEmpty({message: 'Le champ id est vide'})
    id: string;

    @IsNotEmpty({message: 'Le champ id est vide'})
    @IsIn([-1, 1])
    status: number

    @IsNotEmpty({message: 'Le champ user est vide'})
    user: any;
}