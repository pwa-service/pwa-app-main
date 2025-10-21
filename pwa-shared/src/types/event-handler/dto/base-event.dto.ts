import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEventDto {
    @ApiProperty() @IsString() pwaDomain!: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUrl({ require_protocol: true })
    landingUrl?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    queryStringRaw?: string;
}