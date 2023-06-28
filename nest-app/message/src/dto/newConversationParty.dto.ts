import { IsNotEmpty, IsOptional, IsUUID, IsInt, Min, IsString, Matches, IsDateString, isString, IsNumberString } from 'class-validator';

export class newConversationParty {

    @IsNotEmpty()
    @IsString()
    message:string;

    @IsString()
    id:string
}