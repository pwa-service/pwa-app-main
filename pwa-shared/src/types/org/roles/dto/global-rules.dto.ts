import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AccessLevel } from '../../sharing/enums/access.enum';

export class GlobalRulesDto {
    @ApiPropertyOptional({ enum: AccessLevel, description: 'Access level for statistics' })
    @IsOptional()
    @IsEnum(AccessLevel)
    statAccess?: AccessLevel;

    @ApiPropertyOptional({ enum: AccessLevel, description: 'Access level for financials' })
    @IsOptional()
    @IsEnum(AccessLevel)
    finAccess?: AccessLevel;

    @ApiPropertyOptional({ enum: AccessLevel, description: 'Access level for logs' })
    @IsOptional()
    @IsEnum(AccessLevel)
    logAccess?: AccessLevel;

    @ApiPropertyOptional({ enum: AccessLevel, description: 'Access level for user management' })
    @IsOptional()
    @IsEnum(AccessLevel)
    usersAccess?: AccessLevel;

    @ApiPropertyOptional({ enum: AccessLevel, description: 'Access level for sharing settings' })
    @IsOptional()
    @IsEnum(AccessLevel)
    sharingAccess?: AccessLevel;
}