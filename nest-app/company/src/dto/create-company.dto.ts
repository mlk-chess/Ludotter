import { IsEmail, IsNotEmpty } from "class-validator";

export class createCompanyDto {

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    name: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsEmail()
    email: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    address: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    city: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    zipcode: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    message: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    number: number;
}