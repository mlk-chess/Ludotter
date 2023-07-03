import { IsEmail, IsNotEmpty, Length, IsOptional, IsPhoneNumber } from 'class-validator';

export class updateUserDto {

    @IsNotEmpty({message:"Le champ nom est vide."})
    name: string;

    @IsEmail()
    @IsNotEmpty({message:"Le champ email est vide"})
    email: string;

    
    @IsOptional()
    @IsPhoneNumber('FR', { message: 'Le champ doit être un numéro de téléphone valide.' })
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