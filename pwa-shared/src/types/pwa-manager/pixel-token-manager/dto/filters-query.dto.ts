import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class PixelTokenFiltersQueryDto {
    @ApiProperty({ required: false, description: 'Search by token or description' })
    @IsOptional()
    @IsString()
    search?: string;


    @ApiProperty({ required: false, description: 'Filter by specific owner ID (Admin only)' })
    @IsOptional()
    @IsString()
    ownerUsername?: string;
}