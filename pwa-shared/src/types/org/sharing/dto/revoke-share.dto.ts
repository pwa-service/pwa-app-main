import { IsUUID, IsEnum } from 'class-validator';
import { ShareType } from "../enums/access.enum";
import { ApiProperty } from '@nestjs/swagger';

export class RevokeShareDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The unique ID of the share to revoke' })
    @IsUUID()
    shareId!: string;

    @ApiProperty({ enum: ShareType, description: 'The type of share being revoked' })
    @IsEnum(ShareType)
    type!: ShareType;
}