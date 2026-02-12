import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DomainFilterQueryDto {
    @ApiPropertyOptional({ description: 'Пошук по частині імені хоста' })
    @IsOptional()
    @IsString()
    search?: string;


    @ApiPropertyOptional({ description: 'Фільтр по PWA App ID' })
    @IsOptional()
    @IsUUID()
    pwaAppId?: string;
}