import { IsNotEmpty, IsOptional, IsUUID, IsInt, Min, IsString, Matches, IsDateString, IsEmail } from 'class-validator';

export class updateUserDto {

    @IsUUID()
    id: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsString()
    name: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsString()
    firstname: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsString()
    pseudo: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsEmail()
    email: string;

    @IsOptional()
    @IsInt()
    status?: number;

    constructor(data: Partial<updateUserDto>) {
        Object.assign(this, data);
    }
}