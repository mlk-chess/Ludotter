import { IsNotEmpty, IsOptional, IsUUID, IsInt, Min, IsString, Matches, IsDateString, isString, IsNumberString } from 'class-validator';

export class Conversation {

    convId:string;

    @IsNotEmpty()
    @IsString()
    message:string;


    @IsNotEmpty()
    user:any
}