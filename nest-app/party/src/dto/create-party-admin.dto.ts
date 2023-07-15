import { IsNotEmpty, IsOptional, IsUUID, IsInt, Min, IsString, Matches, IsDateString } from 'class-validator';

export class createPartyAdminDto {
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

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {message: "Veuillez entrer une heure valide."})
    time: string;
    
    @IsNotEmpty({message:"Le code postal doit être renseigné."})
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