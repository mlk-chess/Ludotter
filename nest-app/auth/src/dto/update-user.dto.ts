import { IsEmail, IsNotEmpty, Length, IsOptional, Matches } from 'class-validator';

export class updateUserDto {

    @IsNotEmpty({message:"Le champ nom est vide."})
    name: string;

    @IsEmail()
    @IsNotEmpty({message:"Le champ email est vide"})
    email: string;

    
    @IsOptional()
    @Matches(/^0[1-9]\d{8}$/, { message: 'Le champ doit être un numéro de téléphone valide en France.' })
    number?: string

    @IsNotEmpty({message:"Le champ prénom est vide."})
    @IsOptional()
    firstname?: string

    @IsNotEmpty({message:"Le champ pseudo est vide."})
    @IsOptional()
    pseudo?: string

    @IsNotEmpty()
    user:any

}