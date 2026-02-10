import { IsString, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GlobalRulesDto } from './global-rules.dto';

export class CreateRoleDto {
    @ApiProperty({ example: 'Admin', description: 'The name of the role' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'Administrator role with full access', description: 'A description of the role' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ type: () => GlobalRulesDto, description: 'Global access rules for the role' })
    @ValidateNested()
    @Type(() => GlobalRulesDto)
    globalRules: GlobalRulesDto;
}