import {IsString, IsEmail, IsInt, IsUUID, IsOptional, MinLength, IsEnum} from 'class-validator';
import { ScopeType } from '../../roles/enums/scope.enum'

export class UpdateMemberDto {
    @IsUUID()
    id: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @IsOptional()
    @IsEnum(ScopeType)
    scope: ScopeType;

    @IsOptional()
    @IsInt()
    roleId?: number;
}