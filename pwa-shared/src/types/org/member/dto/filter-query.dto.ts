import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class MemberFilterQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    roleId?: number;

    @IsOptional()
    @IsString()
    teamId?: string;

    @IsOptional()
    @IsString()
    campaignId?: string;
}