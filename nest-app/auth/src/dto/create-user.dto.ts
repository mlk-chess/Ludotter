import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class createUserDto {

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    lastname: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    firstname: string

    @IsEmail()
    email: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @Length(6, 20, { message: 'Le mot de passe doit comporter entre 6 et 20 caractères.' })
    password: string;
}