import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'The unique UUID of the user'
    })
    @IsString()
    @IsUUID('4', { message: 'userId must be a valid UUID' })
    @IsNotEmpty()
    userId: string;


    @ApiProperty({
        example: 1,
        description: 'The ID of the role to assign'
    })
    @IsNumber({}, { message: 'roleId must be a number' })
    @IsNotEmpty()
    roleId: number;
}