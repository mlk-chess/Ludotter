import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class createUserDto {

    @IsNotEmpty({message:"Le champ nom est vide."})
    lastname: string;

    @IsNotEmpty({message:"Le champ prénom est vide."})
    firstname: string

    @IsEmail()
    @IsNotEmpty({message:"Le champ email est vide"})
    email: string;

    @IsNotEmpty({message:"Le champ mot de passe est vide."})
    @Length(6, 20, { message: 'Le mot de passe doit comporter entre 6 et 20 caractères.' })
    password: string;

    @IsNotEmpty({message:"Le champ pseudo est vide"})
    pseudo:string
}