import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetGlobalUserAccessDto {
    @ApiProperty({ description: 'The UUID of the user to assign permissions to' })
    @IsUUID()
    targetUserId!: string;

    @ApiProperty({ description: 'The UUID of the access profile to apply' })
    @IsUUID()
    accessProfileId!: string;
}