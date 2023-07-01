import { IsNotEmpty, IsOptional, IsUUID, IsInt, Min, IsString, Matches, IsDateString } from 'class-validator';

export class createUserDto {
    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsString()
    name: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsString()
    firstname: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsDateString()
    birthday: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsString()
    pseudo: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsInt()
    @Min(0)
    balance: number;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsString()
    email: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsString()
    role: string;

    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsInt()
    @Min(0)
    points: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    status?: number;

    constructor(data: Partial<createUserDto>) {
        Object.assign(this, data);
    }
}