import { IsUUID, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ShareWithUserDto {
    @ApiProperty({
        description: 'UUID рабочего объекта (файла/папки), к которому дается доступ',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    workingObjectId!: string;

    @ApiProperty({
        description: 'UUID профиля пользователя, которому предоставляется доступ',
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    })
    @IsUUID()
    targetUserProfileId!: string;

    @ApiProperty({
        description: 'UUID профиля доступа (набор прав, например: Read Only)',
        example: 'b5eebc99-9c0b-4ef8-bb6d-6bb9bd380b22'
    })
    @IsUUID()
    accessProfileId!: string;

    @ApiProperty({
        description: 'UUID профиля пользователя, который инициировал шаринг (автор)',
        example: 'c8eebc99-9c0b-4ef8-bb6d-6bb9bd380c33'
    })
    @IsUUID()
    createdByUserProfileId!: string;

    @ApiPropertyOptional({
        description: 'Дата и время окончания доступа (ISO 8601). Если не указано — доступ бессрочный.',
        example: '2025-12-31T23:59:59Z'
    })
    @IsOptional()
    @IsDateString()
    expiresAt?: string;
}