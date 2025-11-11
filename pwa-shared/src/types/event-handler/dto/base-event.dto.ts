import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {EventMeta} from "../payload/capi.payload";

export class BaseEventDto {
    @ApiProperty()
    @IsOptional()
    @IsString() pwaDomain!: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUrl({ require_protocol: true })
    landingUrl?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    queryStringRaw?: string;

    _meta: EventMeta
}