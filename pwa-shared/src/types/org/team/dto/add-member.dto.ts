import { IsInt, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDto {
    @ApiProperty({
        description: 'UUID команды, в которую добавляется участник',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851'
    })
    @IsUUID('4', { message: 'Invalid Team ID' })
    teamId!: string;

    @ApiProperty({
        description: 'UUID пользователя, которого нужно добавить',
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    })
    @IsUUID('4', { message: 'Invalid Team ID' })
    userId!: string;

    roleId!: number;
}