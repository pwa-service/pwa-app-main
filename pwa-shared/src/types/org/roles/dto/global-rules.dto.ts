import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { AccessLevel } from '../../sharing/enums/access.enum'

export class GlobalRulesDto {
    @IsOptional()
    @IsEnum(AccessLevel)
    statAccess?: AccessLevel;

    @IsOptional()
    @IsEnum(AccessLevel)
    finAccess?: AccessLevel;

    @IsOptional()
    @IsEnum(AccessLevel)
    logAccess?: AccessLevel;

    @IsOptional()
    @IsEnum(AccessLevel)
    usersAccess?: AccessLevel;

    @IsOptional()
    @IsBoolean()
    sharingAccess?: AccessLevel;
}