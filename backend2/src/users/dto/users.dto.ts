import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator'

export class CreateUserDTO {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    hashedPassword: string
}