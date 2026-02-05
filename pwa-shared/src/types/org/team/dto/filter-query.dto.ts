import { IsOptional, IsString } from 'class-validator';

export class TeamFilterQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    campaignId?: string;

    @IsOptional()
    @IsString()
    leadId?: string;
}