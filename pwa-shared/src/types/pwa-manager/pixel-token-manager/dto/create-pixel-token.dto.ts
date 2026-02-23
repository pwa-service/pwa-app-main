import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePixelTokenDto {
    id!: string;

    @ApiProperty({ example: 'EAA...' })
    @IsString()
    @IsNotEmpty()
    token!: string;

    @ApiProperty({ example: 'Основний піксель для FB', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    ownerId!: string;
    campaignId?: string;
    teamId?: string;
}