import { IsNotEmpty, IsOptional, IsUUID, IsInt, Min, IsString, Matches, IsDateString } from 'class-validator';

export class createPartyDto {
    @IsNotEmpty({message:"Veuillez remplir tous les champs."})
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    location: string;

    @IsInt()
    @Min(1)
    players: number;

    @IsUUID()
    owner: string;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    time: string;


    @IsInt()
    zipcode: number;

    @IsDateString()
    dateParty: Date;

    constructor(data: Partial<createPartyDto>) {
        Object.assign(this, data);
    }
}