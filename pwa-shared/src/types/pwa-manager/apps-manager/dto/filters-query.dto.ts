import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PwaStatus } from '@prisma/client';

export class PwaAppFiltersQueryDto {
    @ApiProperty({ required: false, description: 'Search by name or description' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ required: false, enum: PwaStatus, description: 'Filter by app status' })
    @IsOptional()
    @IsEnum(PwaStatus)
    status?: PwaStatus;

    @ApiProperty({ required: false, description: 'Filter by campaign ID' })
    @IsOptional()
    @IsString()
    campaignId?: string;

    @ApiProperty({ required: false, description: 'Filter by owner name' })
    @IsOptional()
    @IsString()
    ownerName?: string;
}
