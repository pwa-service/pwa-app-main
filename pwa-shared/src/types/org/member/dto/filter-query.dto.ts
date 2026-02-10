import {IsOptional, IsString, IsNumber, IsUUID} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class MemberFilterQueryDto {
    @ApiPropertyOptional({ example: 'john', description: 'Search by username or email' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ example: 2, description: 'Filter by Role ID' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    roleId?: number;

    @ApiPropertyOptional({ example: '987fcdeb-51a2-43c1-b456-426614174000', description: 'Filter by Team ID' })
    @IsOptional()
    @IsUUID('4', { message: 'Invalid Team ID' })
    teamId?: string;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Filter by Campaign ID' })
    @IsOptional()
    @IsUUID('4', { message: 'Invalid Team ID' })
    campaignId?: string;
}