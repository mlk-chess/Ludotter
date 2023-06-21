import { IsUUID } from 'class-validator';

export class joinPartyDto {

    
    @IsUUID()
    partyId: string;

    @IsUUID()
    profileId: string;

    constructor(data: Partial<joinPartyDto>) {
        Object.assign(this, data);
    }
}