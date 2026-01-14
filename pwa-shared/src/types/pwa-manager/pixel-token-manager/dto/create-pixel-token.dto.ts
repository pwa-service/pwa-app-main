import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePixelTokenDto {
    @ApiProperty({ example: 'EAA...' })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({ example: 'Основний піксель для FB', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'uuid-user-id', required: false })
    @IsOptional()
    @IsUUID()
    ownerId?: string;
}

export class UpdatePixelTokenDto extends PartialType(CreatePixelTokenDto) {
    id: string;
}