import { IsEmail, IsNotEmpty, IsNumberString, Matches } from "class-validator";

export class updateCompanyDto {

    @IsNotEmpty({message:"Le champ nom est vide."})
    name: string;

    @IsEmail()
    @IsNotEmpty({message:"Le champ email est vide"})
    email: string;

    @IsNotEmpty({message:"Le champ adresse est vide"})
    address: string;

    @IsNotEmpty({message:"Le champ ville est vide"})
    city: string;

    @IsNotEmpty({message:"Le champ code postal est vide"})
    @Matches(/^[0-9]{5}$/, { message: 'Le code postal doit être composé de 5 chiffres.' })
    zipcode: string;

    @IsNotEmpty({message:"Le champ message est vide"})
    message: string;

    @Matches(/^0[1-9]\d{8}$/, { message: 'Le champ doit être un numéro de téléphone valide en France.' })
    number: string;

    @IsNumberString()
    id:string
}