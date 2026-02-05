import { IsString, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { GlobalRulesDto } from './global-rules.dto';

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @ValidateNested()
    @Type(() => GlobalRulesDto)
    globalRules: GlobalRulesDto;
}