import {ApiProperty, OmitType, PartialType} from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePixelTokenDto {
    @ApiProperty({ example: 'Token id', required: false })
    @IsOptional()
    @IsUUID()
    id: string;

    @ApiProperty({ example: 'EAA...' })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({ example: 'Основний піксель для FB', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    ownerId: string;
}

export class UpdatePixelTokenDto extends PartialType(
    OmitType(CreatePixelTokenDto, ['ownerId'] as const),
) {
    id?: string;
}