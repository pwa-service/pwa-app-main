import { IsString, IsOptional, IsUUID } from 'class-validator';

export class RoleFilterQueryDto {
    @IsOptional()
    @IsUUID('4', { message: 'Invalid Campaign ID' })
    campaignId?: string;

    @IsOptional()
    @IsUUID('4', { message: 'Invalid Campaign ID' })
    teamId?: string;

    @IsOptional()
    @IsString()
    search?: string;
}