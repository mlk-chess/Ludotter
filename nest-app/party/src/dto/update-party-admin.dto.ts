import { IsNotEmpty, IsOptional, IsUUID, IsInt, Min, IsString, Matches, IsDateString } from 'class-validator';

export class updatePartyAdminDto {
    @IsUUID()
    id: string;

    @IsNotEmpty({message:"Le nom de la partie doit être renseigné."})
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty({message:"Le lieu de la partie doit être renseigné."})
    @IsString()
    location: string;

    @IsNotEmpty({message:"Il faut au moins deux joueurs pour créer une partie."})
    @IsInt()
    @Min(1)
    players: number;

    @IsNotEmpty({message:"Organisateur manquant."})
    @IsUUID()
    owner: string;

    time: string;
    
    @IsNotEmpty({message:"Le code postal doit être renseigné."})
    @IsInt()
    zipcode: number;

    @IsDateString()
    dateParty: Date;

    @IsOptional()
    @IsInt()
    status?: number;

    constructor(data: Partial<updatePartyAdminDto>) {
        Object.assign(this, data);
    }
}