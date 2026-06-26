import { IsUrl, IsOptional, IsString, IsInt, Min, IsNotEmpty } from 'class-validator';

export class CreateUrlDTO {
    @IsUrl({}, { message: 'Please enter a valid URL including http/https' })
    @IsNotEmpty({ message: 'URL cannot be empty' })
    originalUrl: string

    @IsOptional()
    @IsString()
    customShortUrl?: string

    @IsOptional()
    @IsInt()
    @Min(1)
    expiresInDays?: number;

}