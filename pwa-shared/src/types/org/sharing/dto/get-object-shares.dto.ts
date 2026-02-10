import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetObjectSharesDto {
    @ApiProperty({
        description: 'The UUID of the working object to retrieve shares for',
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    })
    @IsUUID()
    workingObjectId!: string;
}