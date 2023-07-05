import { IsNotEmpty, IsOptional, IsUUID, IsInt, Min, IsString, Matches, IsDateString } from 'class-validator';

export class createPartyAdminDto {
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

    // Match the pattern of a french zipcode
    @Matches(/^(?:[0-8]\d|9[0-8])\d{3}$/)
    @IsInt()
    zipcode: number;

    @IsDateString()
    dateParty: Date;

    // status column
    @IsOptional()
    @IsInt()
    status?: number;

    constructor(data: Partial<createPartyAdminDto>) {
        Object.assign(this, data);
    }
}