import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TelegramAuthDto {
    @ApiProperty({ example: 123456789 })
    @IsNumber()
    id!: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    first_name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    last_name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    photo_url?: string;

    @ApiProperty()
    @IsNumber()
    auth_date!: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    hash!: string;
}