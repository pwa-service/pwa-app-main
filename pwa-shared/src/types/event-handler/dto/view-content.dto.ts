import { IsString, IsOptional, IsUrl } from 'class-validator';

export class ViewContentDto {
    @IsString()
    userId: string;

    @IsString()
    pwaDomain: string;

    @IsOptional()
    @IsUrl({ require_protocol: true }, { message: 'landingUrl must be a valid URL with protocol' })
    landingUrl?: string;

    @IsOptional()
    @IsString()
    queryStringRaw?: string;
}
