import { IsString, IsOptional, IsUrl } from 'class-validator';
export class LeadDto {
    @IsString() userId!: string;
    @IsString() pwaDomain!: string;
    @IsOptional() @IsUrl({ require_protocol: true }) landingUrl?: string;
    @IsOptional() queryStringRaw?: string;
}