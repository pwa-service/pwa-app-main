import { IsString, IsUUID, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {
    @ApiProperty({
        description: 'Название команды (от 3 до 50 символов)',
        example: 'Alpha Squad',
        minLength: 3,
        maxLength: 50
    })
    @IsString()
    @Length(3, 50)
    name!: string;

    @ApiProperty({
        description: 'UUID кампании, к которой будет привязана команда',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851'
    })
    @IsUUID('4')
    campaignId!: string;

    @ApiPropertyOptional({
        description: 'UUID пользователя, который будет назначен лидером (опционально при создании)',
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    })
    @IsOptional()
    @IsUUID('4', { message: 'Invalid Team ID' })
    leadId?: string;
}