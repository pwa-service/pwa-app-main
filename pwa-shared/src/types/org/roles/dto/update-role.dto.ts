import {IsString, IsNotEmpty, IsOptional, ValidateNested} from 'class-validator';
import {Type} from "class-transformer";
import {GlobalRulesDto} from "./global-rules.dto";

export class UpdateRoleDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => GlobalRulesDto)
    globalRules?: GlobalRulesDto;
}