import { IsString, IsOptional, IsUrl } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class ViewContentDto {
    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    pwaDomain: string;

    @ApiProperty()
    @IsOptional()
    @IsUrl({ require_protocol: true }, { message: 'landingUrl must be a valid URL with protocol' })
    landingUrl?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    queryStringRaw?: string;
}
