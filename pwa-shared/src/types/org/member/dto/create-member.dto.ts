import { IsString, IsEmail, IsEnum, IsInt, IsUUID, IsOptional, MinLength } from 'class-validator';
import {ScopeType} from "../../roles/enums/scope.enum";

export class CreateMemberDto {
    @IsString()
    @MinLength(3)
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEmail()
    email: string;

    @IsEnum(ScopeType)
    scope: ScopeType;

    @IsInt()
    roleId: number;

    @IsOptional()
    @IsUUID()
    campaignId?: string;

    @IsOptional()
    @IsUUID()
    teamId?: string;
}