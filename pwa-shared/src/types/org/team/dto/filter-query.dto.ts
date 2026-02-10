import {IsOptional, IsString, IsUUID} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TeamFilterQueryDto {
    @ApiPropertyOptional({
        description: 'Поиск по названию команды (частичное совпадение)',
        example: 'Alpha'
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Фильтр по ID кампании (UUID)',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851'
    })
    @IsOptional()
    @IsUUID('4', { message: 'Invalid Team ID' })
    campaignId?: string;

    @ApiPropertyOptional({
        description: 'Фильтр по ID лидера команды (UUID)',
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    })
    @IsOptional()
    @IsUUID('4', { message: 'Invalid Team ID' })
    leadId?: string;
}