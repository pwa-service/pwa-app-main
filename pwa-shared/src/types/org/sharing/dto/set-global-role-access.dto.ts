import { IsInt, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetGlobalRoleAccessDto {
    @ApiProperty({ example: 5, description: 'The Integer ID of the Global Role' })
    @IsInt()
    roleId!: number;

    @ApiProperty({ example: 'uuid-string', description: 'The UUID of the Access Profile' })
    @IsUUID()
    accessProfileId!: string;
}