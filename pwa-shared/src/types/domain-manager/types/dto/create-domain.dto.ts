import { IsString, IsUUID, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDomainDto {
    @ApiProperty({
        description: 'Доменне ім\'я (без протоколу)',
        example: 'shop.example.com'
    })
    @IsString()
    @Matches(/^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/, {
        message: 'Invalid hostname format'
    })
    hostname: string;

    @ApiProperty({
        description: 'ID PWA додатку, до якого прив\'язаний домен',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    pwaAppId: string;

    @ApiProperty({
        description: 'ID CampaignUser (власника)',
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    })
    @IsUUID()
    ownerId: string;
}