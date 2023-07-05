import { IsNotEmpty, IsOptional, IsUUID, IsInt, Min, IsString, Matches, IsDateString } from 'class-validator';

export class updatePartyDto {
    
    @IsUUID()
    id: string;

    @IsOptional()
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

    @IsOptional()
    @IsInt()
    @Matches(/^(?:[0-8]\d|9[0-8])\d{3}$/)
    zipcode?: number;

    @IsOptional()
    @IsDateString()
    dateParty?: Date;

    constructor(data: Partial<updatePartyDto>) {
        Object.assign(this, data);
    }
}