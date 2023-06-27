import { IsNotEmpty, IsOptional, IsUUID, IsInt, Min, IsString, Matches, IsDateString, isString, IsNumberString } from 'class-validator';

export class ConversationPartyDto {


    
    convId:string;

    @IsNotEmpty()
    @IsString()
    message:string;
}