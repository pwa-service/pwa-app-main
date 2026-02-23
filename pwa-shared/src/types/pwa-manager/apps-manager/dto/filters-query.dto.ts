import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PwaAppStatus } from '../enum/pwa-status.enum';


export class PwaAppFiltersQueryDto {
    @ApiProperty({ required: false, description: 'Search by name or description' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ required: false, enum: PwaAppStatus, description: 'Filter by app status' })
    @IsOptional()
    @IsEnum(PwaAppStatus)
    status?: PwaAppStatus;

    @ApiProperty({ required: false, description: 'Filter by campaign ID' })
    @IsOptional()
    @IsString()
    campaignId?: string;

    @ApiProperty({ required: false, description: 'Filter by owner name' })
    @IsOptional()
    @IsString()
    ownerName?: string;
}
