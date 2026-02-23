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
}