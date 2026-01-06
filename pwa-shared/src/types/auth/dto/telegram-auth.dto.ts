import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TelegramAuthDto {
    @ApiProperty({ example: 123456789 })
    @IsNumber()
    id!: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    photoUrl?: string;

    @ApiProperty()
    @IsNumber()
    authDate!: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    hash!: string;
}