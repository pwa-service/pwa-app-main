import { IsString, IsOptional, IsUrl } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
export class LeadDto {
    @ApiProperty()
    @IsString()
    userId!: string;

    @ApiProperty()
    @IsString()
    pwaDomain!: string;

    @ApiProperty()
    @IsOptional()
    @IsUrl({ require_protocol: true })
    landingUrl?: string;

    @ApiProperty()
    @IsOptional()
    queryStringRaw?: string;
}