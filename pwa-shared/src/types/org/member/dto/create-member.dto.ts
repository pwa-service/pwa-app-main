import { IsString, IsEmail, IsEnum, IsInt, IsUUID, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ScopeType } from "../../roles/enums/scope.enum";

export class CreateCampaignMemberDto {
    @ApiProperty({ example: 'johndoe', description: 'Username (min 3 chars)' })
    @IsString()
    @MinLength(3)
    username: string;

    @ApiProperty({ example: 'strongPassword123', description: 'Password (min 6 chars)' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'john@example.com', description: 'User email' })
    @IsEmail()
    email: string;

    scope: ScopeType;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Campaign ID (if applicable)' })
    @IsOptional()
    campaignId?: string;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Role id (if applicable)' })
    @IsOptional()
    roleId?: string;
}