import { IsString, IsUUID, IsInt, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ShareWithRoleDto {
    @ApiProperty()
    @IsUUID()
    workingObjectId!: string;

    @ApiProperty({ description: 'Integer ID of the recipient Role' })
    @IsInt()
    roleId!: number;

    @ApiProperty()
    @IsUUID()
    accessProfileId!: string;

    @ApiPropertyOptional({ description: 'If shared by a user in Campaign context' })
    @IsOptional()
    @IsUUID()
    createdByCampaignUserId?: string;

    @ApiPropertyOptional({ description: 'If shared by a user in Team context' })
    @IsOptional()
    @IsUUID()
    createdByTeamUserId?: string;

    @ApiPropertyOptional({ example: '2025-12-31T23:59:59Z' })
    @IsOptional()
    @IsDateString()
    expiresAt?: string;
}