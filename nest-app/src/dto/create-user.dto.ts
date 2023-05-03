import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class createUserDto {

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    firstname: string

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}