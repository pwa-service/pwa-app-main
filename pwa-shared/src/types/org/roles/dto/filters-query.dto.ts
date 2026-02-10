import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RoleFilterQueryDto {
    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Filter roles by Campaign ID'
    })
    @IsOptional()
    @IsUUID('4', { message: 'Invalid Campaign ID' })
    campaignId?: string;

    @ApiPropertyOptional({
        example: '987fcdeb-51a2-43c1-b456-426614174000',
        description: 'Filter roles by Team ID'
    })
    @IsOptional()
    @IsUUID('4', { message: 'Invalid Team ID' })
    teamId?: string;

    @ApiPropertyOptional({
        example: 'manager',
        description: 'Search roles by name or description'
    })
    @IsOptional()
    @IsString()
    search?: string;
}