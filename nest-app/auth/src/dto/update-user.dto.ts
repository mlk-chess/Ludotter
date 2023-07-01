import { IsEmail, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class updateUserDto {

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    name: string;

    @IsEmail()
    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    email: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsOptional()
    number?: string

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsOptional()
    firstname?: string

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsOptional()
    pseudo?: string

    @IsNotEmpty()
    user:any

}