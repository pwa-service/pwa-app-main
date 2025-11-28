import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class TelegramAuthDto {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    first_name?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    last_name?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    username?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    photo_url?: string;

    @ApiProperty()
    @IsNumber()
    auth_date: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    hash: string;
}