import { IsUrl, IsOptional, IsString, IsInt, Min } from 'class-validator';
export class CreateUrlDto {
    @IsUrl({}, { message: 'originalUrl must be a valid URL including http/https' })
    originalUrl: string;
    @IsOptional()
    @IsString()

    customCode?: string; // user-supplied short code
    @IsOptional()
    @IsInt()
    @Min(1)

    expiresInDays?: number;
}