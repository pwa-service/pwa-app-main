import { IsString, IsUUID, IsInt, IsOptional, IsDateString } from 'class-validator';

export class ShareWithRoleDto {
    @IsUUID()
    workingObjectId!: string;

    @IsInt()
    roleId!: number;

    @IsUUID()
    accessProfileId!: string;

    @IsOptional()
    @IsUUID()
    createdByCampaignUserId?: string;

    @IsOptional()
    @IsUUID()
    createdByTeamUserId?: string;

    @IsOptional()
    @IsDateString()
    expiresAt?: string;
}