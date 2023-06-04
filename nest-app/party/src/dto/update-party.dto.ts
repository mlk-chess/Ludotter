import { IsNotEmpty, IsOptional, IsUUID, IsInt, Min, IsString, Matches } from 'class-validator';

export class updatePartyDto {
    
    @IsUUID()
    id: string;

    @IsNotEmpty({ message: "Veuillez remplir tous les champs." })
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsInt()
    @Min(2)
    players?: number;

    @IsOptional()
    @IsUUID()
    owner?: string;

    @IsOptional()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    time?: string;

    constructor(data: Partial<updatePartyDto>) {
        Object.assign(this, data);
    }
}